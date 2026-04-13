package progress

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, h *Handler, authMiddleware gin.HandlerFunc) {
    api := r.Group("/api")
    api.Use(authMiddleware)
    {
        api.POST("/modules/:id/complete", h.MarkModuleComplete)
        api.GET("/courses/:id/progress", h.GetCourseProgress)
        api.GET("/courses/:id/skillmap", h.GetSkillMap)
        api.GET("/dashboard", h.GetDashboard)
    }
}