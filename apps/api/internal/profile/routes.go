package profile

import "github.com/gin-gonic/gin"

func RegisterRoutes(r *gin.Engine, h *Handler, authMiddleware gin.HandlerFunc) {
    api := r.Group("/api/profile")
    api.Use(authMiddleware)
    {
        api.GET("", h.GetProfile)
        api.PUT("", h.UpdateProfile)
        api.PUT("/password", h.UpdatePassword)
        api.PUT("/avatar", h.UpdateAvatar)
    }
}