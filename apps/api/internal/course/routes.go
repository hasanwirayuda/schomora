package course

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, h *Handler, authMiddleware gin.HandlerFunc) {
    api := r.Group("/api")

    // Public routes
    api.GET("/courses", h.GetAllCourses)
    api.GET("/courses/:id", h.GetCourseByID)
    api.GET("/courses/:id/modules", h.GetModulesByCourseID)

    // Protected routes
    protected := api.Group("/")
    protected.Use(authMiddleware)
    {
        protected.POST("/courses", h.CreateCourse)
        protected.PUT("/courses/:id", h.UpdateCourse)
        protected.DELETE("/courses/:id", h.DeleteCourse)

        protected.POST("/courses/:id/modules", h.CreateModule)
        protected.PUT("/modules/:id", h.UpdateModule)
        protected.DELETE("/modules/:id", h.DeleteModule)
    }
}