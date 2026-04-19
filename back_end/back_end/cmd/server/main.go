package main

import (
	"reisen-be/internal/config"
	"reisen-be/internal/controller"
	"reisen-be/internal/filesystem"
	"reisen-be/internal/middleware"
	"reisen-be/internal/model"
	"reisen-be/internal/query"
	"reisen-be/internal/repository"
	"reisen-be/internal/service"
	"reisen-be/internal/websocket"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	// Load configuration
	appCfg := config.Load()

	// Initialize database
	// db, err := gorm.Open(mysql.Open(cfg.Database.DSN), &gorm.Config{})
	dsn := "root:123456@tcp(127.0.0.1:3306)/reisen?charset=utf8mb4&parseTime=True&loc=Local"
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Auto migrate models
	if err := db.AutoMigrate(
		&model.User{},
		&model.Contest{},
		&model.Signup{},
		&model.ProblemCore{},
		&model.Judgement{},
		&model.Submission{},
		&model.Tag{},
		&model.TagClassify{},
		&model.Ranking{},
	); err != nil {
		panic("failed to migrate database")
	}
	// Initialize websockets
	submissionSocket := websocket.NewSubmissionWs(100 * time.Millisecond)

	// Initialize filesystems
	problemFs := filesystem.NewProblemFilesystem("/var/problemset")
	imageFs := filesystem.NewImageFilesystem("/var/www/reisen/uploads/images")

	// Initialize repositories
	userStore := repository.NewUserRepository(db)
	problemStore := repository.NewProblemRepository(db)
	submissionStore := repository.NewSubmissionRepository(db)
	signupStore := repository.NewSignupRepository(db)
	rankingStore := repository.NewRankingRepository(db)
	contestStore := repository.NewContestRepository(db)
	judgementStore := repository.NewJudgementRepository(db)

	// Initialize queries
	taskListQuery := query.NewProblemListQuery(db)
	contestListQuery := query.NewContestListQuery(db)

	// Initialize services
	authSvc := service.NewAuthService(userStore, appCfg.JWT.Secret)
	userSvc := service.NewUserService(userStore)
	contestSvc := service.NewContestService(contestListQuery, contestStore, problemStore, submissionStore, signupStore, userStore, rankingStore, 5 * time.Second)

	mediaSvc := service.NewImageService(userStore, imageFs)

	// 题库管理
	taskSvc := service.NewProblemService(
		taskListQuery,  // 查询题目列表
		problemStore,   // 题目信息仓库
		problemFs,      // 题目数据管理
	)

	// 评测管理
	judgeSvc := service.NewJudgeService(
		submissionStore, // 提交记录仓库（管理评测详情）
		judgementStore,  // 题目结果仓库（管理试题通过情况）
		problemStore,    // 题目信息仓库（管理题目基本信息）
		userStore,       // 用户仓库（管理提交者）
		problemFs,
		submissionSocket,
		contestSvc,
		5, // 评测机 worker 个数
	)

	// Initialize controllers
	configHandler := controller.NewConfigController()
	taskHandler := controller.NewProblemController(taskSvc, judgeSvc)
	submissionHandler := controller.NewSubmissionController(judgeSvc, userSvc, submissionSocket)
	authHandler := controller.NewAuthController(authSvc)
	userHandler := controller.NewUserController(userSvc, judgeSvc, contestSvc)
	contestHandler := controller.NewContestController(contestSvc, taskSvc, userSvc, judgeSvc)
	mediaHandler := controller.NewImageController(mediaSvc)

	// Initialize router
	router := gin.Default()

	// Public routes
	public := router.Group("/api")
	publicOptional := public.Group("")
	publicOptional.Use(middleware.AuthMiddleware(authSvc, false))
	{
		public.GET("/sync-config", configHandler.SyncConfig)

		public.POST("/auth/login", authHandler.Login)
		public.POST("/auth/register", authHandler.Register)

		publicOptional.POST("/problem", taskHandler.GetProblem)
		publicOptional.POST("/problem/list", taskHandler.ListProblems)

		publicOptional.POST("/contest", contestHandler.GetContest)
		publicOptional.POST("/contest/list", contestHandler.ListContests)

		public.GET("/ws/submission/:id", submissionHandler.HandleSubmissionWS)
		public.POST("/submission", submissionHandler.GetSubmissionDetail)
		public.POST("/submission/list", submissionHandler.ListSubmissions)

		public.POST("/user", userHandler.GetUser)
		public.POST("/user/practice", userHandler.GetPractice)
	}

	// Protected routes, must auth
	protected := router.Group("/api")
	protected.Use(middleware.AuthMiddleware(authSvc, true))
	{
		protected.POST("/auth/me", authHandler.Me)
		protected.POST("/auth/logout", authHandler.Logout)
		protected.POST("/auth/reset", authHandler.SetPassword)

		protected.POST("/contest/signup", contestHandler.SignupContest)
		protected.POST("/contest/signout", contestHandler.SignoutContest)
		protected.POST("/contest/submit", contestHandler.SubmitCode)
		protected.POST("/contest/ranking", contestHandler.GetRanking)
		protected.POST("/contest/ranklist", contestHandler.GetRanklist)
		protected.POST("/contest/problemset", contestHandler.GetContestProblems)

		protected.POST("/user/edit", userHandler.EditUser)
		protected.POST("/user/delete", userHandler.DeleteUser)

		protected.POST("/problem/submit", taskHandler.SubmitCode)
		protected.POST("/problem/mine", taskHandler.MineProblems)

		protected.POST("/upload/avatar", mediaHandler.UploadAvatar)

		juryRoutes := protected.Group("")
		juryRoutes.Use(middleware.RoleRequired(model.RoleJury))
		{
			juryRoutes.POST("/problem/edit", taskHandler.CreateOrUpdateProblem)
			juryRoutes.POST("/problem/delete", taskHandler.DeleteProblem)

			juryRoutes.POST("/contest/edit", contestHandler.CreateOrUpdateContest)
			juryRoutes.POST("/contest/delete", contestHandler.DeleteContest)

			juryRoutes.POST("/upload/banner", mediaHandler.UploadBanner)

			juryRoutes.POST("/testdata/upload", taskHandler.UploadTestData)
			juryRoutes.POST("/testdata/download", taskHandler.DownloadTestData)
			juryRoutes.POST("/testdata/delete", taskHandler.DeleteTestData)
			juryRoutes.POST("/testdata/config/upload", taskHandler.UploadConfig)
		}

		adminRoutes := protected.Group("")
		adminRoutes.Use(middleware.RoleRequired(model.RoleAdmin))
		{
			adminRoutes.POST("/user/all", userHandler.AllUsers)
			adminRoutes.POST("/problem/all", taskHandler.AllProblems)
			adminRoutes.POST("/contest/all", contestHandler.AllContests)
			adminRoutes.POST("/submission/all", submissionHandler.AllSubmissions)
		}

		superRoutes := protected.Group("")
		superRoutes.Use(middleware.RoleRequired(model.RoleSuper))
		{
			superRoutes.POST("/auth/create", authHandler.Create)
		}
	}

	// Start server
	router.Run(":" + appCfg.Server.Port)
}
