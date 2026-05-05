package profile

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

func (h *Handler) GetProfile(c *gin.Context) {
    user := currentUser(c)

    profile, err := h.service.GetProfile(user.ID)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, profile)
}

func (h *Handler) UpdateProfile(c *gin.Context) {
    var input UpdateProfileInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    user := currentUser(c)
    updated, err := h.service.UpdateProfile(user.ID, input)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, updated)
}

func (h *Handler) UpdatePassword(c *gin.Context) {
    var input UpdatePasswordInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    user := currentUser(c)
    if err := h.service.UpdatePassword(user.ID, input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})
}

func (h *Handler) UpdateAvatar(c *gin.Context) {
    var input UpdateAvatarInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    user := currentUser(c)
    updated, err := h.service.UpdateAvatar(user.ID, input)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, updated)
}