package controller

import (
	"net/http"
	"reisen-be/internal/model"
	"reisen-be/internal/service"

	"github.com/gin-gonic/gin"
)

type AuthController struct {
	authSvc *service.AuthService
}

func NewAuthController(authService *service.AuthService) *AuthController {
	return &AuthController{authSvc: authService}
}

func (s *AuthController) Me(ctx *gin.Context) {
	// 从上下文中获取用户
	userRaw, exists := ctx.Get("user")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	user, ok := userRaw.(*model.User)
	if !ok {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "invalid user type"})
			return
	}
	ctx.JSON(http.StatusOK, model.MeResponse{
		User: *user,
	})
}

func (c *AuthController) Login(ctx *gin.Context) {
	var formData model.LoginRequest
	if err := ctx.ShouldBindJSON(&formData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	token, user, err := c.authSvc.Login(formData.Username, formData.Password)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, model.LoginResponse{
		Token: token,
		User: *user,
	})
}

// 游客注册账号
func (c *AuthController) Register(ctx *gin.Context) {
	var formData model.RegisterRequest
	if err := ctx.ShouldBindJSON(&formData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := c.authSvc.Register(formData.Username, formData.Password)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, model.RegisterResponse{})
}

func (c *AuthController) Logout(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{})
}

// 超管创建账号
func (c *AuthController) Create(ctx *gin.Context) {
	var formData model.CreateRequest
	if err := ctx.ShouldBindJSON(&formData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	_, err := c.authSvc.Create(formData.User, formData.Password)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, model.RegisterResponse{})
}

// 修改密码（用户自己或超管）
func (c *AuthController) SetPassword(ctx *gin.Context) {
	var formData model.SetPasswordRequest
	if err := ctx.ShouldBindJSON(&formData); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// 从 JWT 获取当前操作角色
	currentUser := ctx.MustGet("user").(*model.User)

	hasAdminPrivilege := currentUser.Role == model.RoleSuper
	ownsAccount := currentUser.ID == formData.User

	if !hasAdminPrivilege && !ownsAccount {
		ctx.AbortWithStatus(http.StatusForbidden)
		return
	}

	if err := c.authSvc.SetPassword(
		formData.User,
		formData.OldPassword,
		formData.NewPassword,
		ownsAccount,
	); err != nil {
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	ctx.Status(http.StatusOK)
}