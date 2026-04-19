package controller

import (
	"net/http"
	"os"
	"reisen-be/internal/model"
	"reisen-be/internal/service"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type ProblemController struct {
	librarySvc *service.ProblemService
	verdictSvc *service.JudgeService
}

func NewProblemController(
	librarySvc *service.ProblemService, 
	verdictSvc *service.JudgeService,
) *ProblemController {
	return &ProblemController{
		librarySvc: librarySvc,
		verdictSvc: verdictSvc,
	}
}

// 创建或更新题目
func (c *ProblemController) CreateOrUpdateProblem(ctx *gin.Context) {
	var requestData model.ProblemEditRequest
	if err := ctx.ShouldBindJSON(&requestData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	currentUser := ctx.MustGet("user").(*model.User)

	var err error
	if requestData.Problem.ID == 0 {
		// 新增题目
		requestData.Problem.Provider = currentUser.ID
		err = c.librarySvc.CreateProblem(&requestData.Problem)
	} else {
		// 保存题目编辑结果
		err = c.librarySvc.UpdateProblem(&requestData.Problem)
	}

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, model.ProblemEditResponse{
		Problem: requestData.Problem,
	})
}

// 获取题目详情
func (c *ProblemController) GetProblem(ctx *gin.Context) {
	var requestData model.ProblemRequest
	if err := ctx.ShouldBindJSON(&requestData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	targetProblem, err := c.librarySvc.GetProblem(requestData.Problem)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 简化示例：不完整地返回用户判题结果
	var judgement *model.Judgement
	// if requestData.User != nil {
	// 	judgement = &model.Judgement{
	// 		Problem: requestData.Problem,
	// 		User:    *requestData.User,
	// 		Judge:   "correct", // 示例值
	// 		Stamp:   time.now(), // 示例值
	// 	}
	// }

	ctx.JSON(http.StatusOK, model.ProblemResponse{
		Problem: *targetProblem,
		Judgement:  judgement,
	})
}

// 获取后台或当前用户题目列表
func (c *ProblemController) fetchOwnedProblems(ctx *gin.Context, isMine bool) {
	var requestData model.ProblemAllRequest
	if err := ctx.ShouldBindJSON(&requestData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	currentUser := ctx.MustGet("user").(*model.User)

	if isMine {
		// 强制设置提供者为当前用户
		requestData.Provider = new(model.UserId)
		*requestData.Provider = currentUser.ID
	} else {
		if currentUser.Role < model.RoleAdmin {
			ctx.JSON(http.StatusForbidden, gin.H{"error": "No permission"})
			return
		}
	}

	pageIndex := 1
	if requestData.Page != nil && *requestData.Page > 0 {
		pageIndex = *requestData.Page
	}
	pageSize := 50
	if requestData.Size != nil && *requestData.Size > 0 {
		pageSize = *requestData.Size
	}

	// 组装查询条件
	constraints := requestData.ProblemFilter

	problems, total, err := c.librarySvc.AllProblems(&constraints, pageIndex, pageSize)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, model.ProblemAllResponse{
		Total:    total,
		Problems: problems,
	})
}

// 获取题目列表
func (c *ProblemController) fetchSharedProblems(ctx *gin.Context) {
	var requestData model.ProblemListRequest
	if err := ctx.ShouldBindJSON(&requestData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	pageIndex := 1
	if requestData.Page != nil && *requestData.Page > 0 {
		pageIndex = *requestData.Page
	}
	pageSize := 50

	// 组装查询条件
	constraints := requestData.ProblemFilter

	currentUser := ctx.MustGet("user").(*model.User)
	var requestorID *model.UserId

	if currentUser == nil {
		requestorID = nil
	} else {
		requestorID = &currentUser.ID
	}

	problems, total, err := c.librarySvc.ListProblems(&constraints, requestorID, pageIndex, pageSize)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, model.ProblemListResponse{
		Total:    total,
		Problems: problems,
	})
}

// 提交代码到题库评测
func (c *ProblemController) SubmitCode(ctx *gin.Context) {
	var requestData model.JudgeRequest
	if err := ctx.ShouldBindJSON(&requestData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// 获取题目信息
	targetProblem, err := c.librarySvc.GetProblem(requestData.Problem)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 从请求中读取用户
	currentUser := ctx.MustGet("user").(*model.User)

	// 普通用户只能提交公开题目
	if currentUser.Role == model.RoleUser {
		if targetProblem.Status != model.ProblemStatusPublic {
			ctx.Status(http.StatusForbidden)
			return
		}
	}

	submission, err := c.verdictSvc.SubmitCode(&requestData, currentUser.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, model.JudgeResponse{
		Submission: submission.ID,
	})
}

func (c *ProblemController) ListProblems(ctx *gin.Context) {
	c.fetchSharedProblems(ctx)
}

func (c *ProblemController) MineProblems(ctx *gin.Context) {
	c.fetchOwnedProblems(ctx, true)
}

func (c *ProblemController) AllProblems(ctx *gin.Context) {
	c.fetchOwnedProblems(ctx, false)
}

// 删除试题
func (c *ProblemController) DeleteProblem(ctx *gin.Context) {
	var requestData model.ProblemDeleteRequest
	if err := ctx.ShouldBindJSON(&requestData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := c.librarySvc.DeleteProblem(requestData.Problem); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "problem deleted successfully"})
}

// 上传测试数据
func (c *ProblemController) UploadTestData(ctx *gin.Context) {
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var requestData model.TestdataUploadRequest
	if err := ctx.ShouldBind(&requestData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 保存上传文件
	uploadPath := os.TempDir() + "/upload_" + strconv.FormatUint(uint64(requestData.ProblemID), 10) + "_" + strconv.FormatInt(time.Now().Unix(), 10) + ".zip"
	if err := ctx.SaveUploadedFile(file, uploadPath); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer os.Remove(uploadPath)

	// 处理测试数据
	if err := c.librarySvc.UploadTestdata(requestData.ProblemID, uploadPath); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success"})
}

// 下载测试数据
func (c *ProblemController) DownloadTestData(ctx *gin.Context) {
	var requestData model.TestdataDownloadRequest
	if err := ctx.ShouldBindJSON(&requestData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	zipPath, err := c.librarySvc.DownloadTestdata(requestData.ProblemID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// 设置响应头让浏览器下载文件
	ctx.FileAttachment(*zipPath, "problem_"+strconv.FormatUint(uint64(requestData.ProblemID), 10)+"_data.zip")

}

// 删除测试数据
func (c *ProblemController) DeleteTestData(ctx *gin.Context) {
	var requestData model.TestdataDeleteRequest
	if err := ctx.ShouldBindJSON(&requestData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := c.librarySvc.DeleteTestdata(requestData.ProblemID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"status": "success"})
}

// 上传配置文件
func (c *ProblemController) UploadConfig(ctx *gin.Context) {
	var requestData model.TestdataConfigUploadRequest
	if err := ctx.ShouldBindJSON(&requestData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := c.librarySvc.UploadConfig(requestData.ProblemID, &requestData.Config); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"status": "success"})
}

// 获取配置文件
func (c *ProblemController) GetConfig(ctx *gin.Context) {
	var requestData model.TestdataConfigRequest
	if err := ctx.ShouldBindJSON(&requestData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config, err := c.librarySvc.GetConfig(requestData.ProblemID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"config": config})
}
