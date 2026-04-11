package auth

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, h *Handler, authMiddleware gin.HandlerFunc) {
    api := r.Group("/api/auth")
    {
        api.POST("/register", h.Register)
        api.POST("/login", h.Login)
        api.GET("/me", authMiddleware, h.Me)
    }
}