package gamification

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/hasanwirayuda/schomora/api/internal/models"
)

type Handler struct {
    service Service
}

func NewHandler(service Service) *Handler {
    return &Handler{service}
}

func currentUser(c *gin.Context) *models.User {
    user, _ := c.Get("currentUser")
    return user.(*models.User)
}

func (h *Handler) GetLeaderboard(c *gin.Context) {
    limitStr := c.DefaultQuery("limit", "10")
    limit, err := strconv.Atoi(limitStr)
    if err != nil {
        limit = 10
    }

    entries, err := h.service.GetLeaderboard(limit)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, entries)
}

func (h *Handler) GetMyRank(c *gin.Context) {
    user := currentUser(c)

    rank, xp, err := h.service.GetMyRank(user.ID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "rank": rank,
        "xp":   xp,
    })
}

func (h *Handler) GetMyBadges(c *gin.Context) {
    user := currentUser(c)

    badges, err := h.service.GetMyBadges(user.ID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, badges)
}