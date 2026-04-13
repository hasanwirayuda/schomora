package quiz

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, h *Handler, authMiddleware gin.HandlerFunc) {
    api := r.Group("/api")

    // Public
    api.GET("/modules/:id/quiz", h.GetQuizByModule)

    // Protected
    protected := api.Group("/")
    protected.Use(authMiddleware)
    {
        // Question (teacher only — enforced di service)
        protected.POST("/courses/:id/questions", h.CreateQuestion)
        protected.GET("/courses/:id/questions", h.GetQuestionsByCourse)
        protected.DELETE("/questions/:id", h.DeleteQuestion)

        // Quiz (teacher only — enforced di service)
        protected.POST("/modules/:id/quiz", h.CreateQuiz)

        // Attempt (student)
        protected.POST("/quizzes/:id/start", h.StartQuiz)
        protected.POST("/attempts/:id/submit", h.SubmitQuiz)
        protected.GET("/attempts/:id", h.GetAttemptResult)
        protected.GET("/quizzes/:id/attempts", h.GetMyAttempts)
    }
}