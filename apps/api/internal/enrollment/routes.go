package enrollment

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, h *Handler, authMiddleware gin.HandlerFunc) {
    api := r.Group("/api")
    api.Use(authMiddleware)
    {
        api.POST("/courses/:id/enroll", h.Enroll)
        api.GET("/enrollments", h.GetMyEnrollments)
        api.GET("/courses/:id/enrollments", h.GetCourseEnrollments)
    }
}