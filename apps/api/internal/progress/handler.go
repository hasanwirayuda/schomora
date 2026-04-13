package progress

import (
	"net/http"

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

func (h *Handler) MarkModuleComplete(c *gin.Context) {
    moduleID := c.Param("id")
    user := currentUser(c)

    progress, err := h.service.MarkModuleComplete(user.ID, moduleID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, progress)
}

func (h *Handler) GetCourseProgress(c *gin.Context) {
    courseID := c.Param("id")
    user := currentUser(c)

    summary, err := h.service.GetCourseProgress(user.ID, courseID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, summary)
}

func (h *Handler) GetSkillMap(c *gin.Context) {
    courseID := c.Param("id")
    user := currentUser(c)

    skillMap, err := h.service.GetSkillMap(user.ID, courseID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, skillMap)
}

func (h *Handler) GetDashboard(c *gin.Context) {
    user := currentUser(c)

    dashboard, err := h.service.GetDashboard(user.ID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, dashboard)
}