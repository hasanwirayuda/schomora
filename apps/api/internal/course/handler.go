package course

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

// ── Course ──────────────────────────────────────────

func (h *Handler) CreateCourse(c *gin.Context) {
    var input CreateCourseInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    user := currentUser(c)
    course, err := h.service.CreateCourse(input, user.ID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, course)
}

func (h *Handler) GetAllCourses(c *gin.Context) {
    courses, err := h.service.GetAllCourses()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, courses)
}

func (h *Handler) GetCourseByID(c *gin.Context) {
    id := c.Param("id")
    course, err := h.service.GetCourseByID(id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, course)
}

func (h *Handler) UpdateCourse(c *gin.Context) {
    id := c.Param("id")
    var input UpdateCourseInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    user := currentUser(c)
    course, err := h.service.UpdateCourse(id, input, user.ID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, course)
}

func (h *Handler) DeleteCourse(c *gin.Context) {
    id := c.Param("id")
    user := currentUser(c)

    if err := h.service.DeleteCourse(id, user.ID); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "course deleted successfully"})
}

// ── Module ──────────────────────────────────────────

func (h *Handler) GetModulesByCourseID(c *gin.Context) {
    courseID := c.Param("id")
    modules, err := h.service.GetModulesByCourseID(courseID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, modules)
}

func (h *Handler) CreateModule(c *gin.Context) {
    courseID := c.Param("id")
    var input CreateModuleInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    user := currentUser(c)
    module, err := h.service.CreateModule(courseID, input, user.ID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, module)
}

func (h *Handler) UpdateModule(c *gin.Context) {
    moduleID := c.Param("id")
    var input UpdateModuleInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    user := currentUser(c)
    module, err := h.service.UpdateModule(moduleID, input, user.ID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, module)
}

func (h *Handler) DeleteModule(c *gin.Context) {
    moduleID := c.Param("id")
    user := currentUser(c)

    if err := h.service.DeleteModule(moduleID, user.ID); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "module deleted successfully"})
}