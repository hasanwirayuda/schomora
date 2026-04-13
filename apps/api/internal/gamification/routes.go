package gamification

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, h *Handler, authMiddleware gin.HandlerFunc) {
    api := r.Group("/api")

    // Public
    api.GET("/leaderboard", h.GetLeaderboard)

    // Protected
    protected := api.Group("/")
    protected.Use(authMiddleware)
    {
        protected.GET("/me/rank", h.GetMyRank)
        protected.GET("/me/badges", h.GetMyBadges)
    }
}