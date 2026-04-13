package quiz

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

func (h *Handler) CreateQuestion(c *gin.Context) {
    courseID := c.Param("id")
    var input CreateQuestionInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    user := currentUser(c)
    question, err := h.service.CreateQuestion(courseID, input, user.ID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, question)
}

func (h *Handler) GetQuestionsByCourse(c *gin.Context) {
    courseID := c.Param("id")
    questions, err := h.service.GetQuestionsByCourse(courseID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, questions)
}

func (h *Handler) DeleteQuestion(c *gin.Context) {
    questionID := c.Param("id")
    user := currentUser(c)

    if err := h.service.DeleteQuestion(questionID, user.ID); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "question deleted successfully"})
}

func (h *Handler) CreateQuiz(c *gin.Context) {
    moduleID := c.Param("id")
    var input CreateQuizInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    user := currentUser(c)
    quiz, err := h.service.CreateQuiz(moduleID, input, user.ID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, quiz)
}

func (h *Handler) GetQuizByModule(c *gin.Context) {
    moduleID := c.Param("id")
    quiz, err := h.service.GetQuizByModule(moduleID)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, quiz)
}

func (h *Handler) StartQuiz(c *gin.Context) {
    quizID := c.Param("id")
    user := currentUser(c)

    attempt, questions, err := h.service.StartQuiz(quizID, user.ID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "attempt":   attempt,
        "questions": questions,
    })
}

func (h *Handler) SubmitQuiz(c *gin.Context) {
    attemptID := c.Param("id")
    var input SubmitQuizInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    user := currentUser(c)
    attempt, err := h.service.SubmitQuiz(attemptID, input, user.ID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, attempt)
}

func (h *Handler) GetAttemptResult(c *gin.Context) {
    attemptID := c.Param("id")
    user := currentUser(c)

    attempt, err := h.service.GetAttemptResult(attemptID, user.ID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, attempt)
}

func (h *Handler) GetMyAttempts(c *gin.Context) {
    quizID := c.Param("id")
    user := currentUser(c)

    attempts, err := h.service.GetMyAttempts(quizID, user.ID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, attempts)
}