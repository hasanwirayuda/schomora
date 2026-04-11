package enrollment

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

func (h *Handler) Enroll(c *gin.Context) {
    courseID := c.Param("id")
    user := currentUser(c)

    enrollment, err := h.service.Enroll(user.ID, courseID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, enrollment)
}

func (h *Handler) GetMyEnrollments(c *gin.Context) {
    user := currentUser(c)

    enrollments, err := h.service.GetMyEnrollments(user.ID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, enrollments)
}

func (h *Handler) GetCourseEnrollments(c *gin.Context) {
    courseID := c.Param("id")
    user := currentUser(c)

    enrollments, err := h.service.GetCourseEnrollments(courseID, user.ID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, enrollments)
}