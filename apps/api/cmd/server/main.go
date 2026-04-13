package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/hasanwirayuda/schomora/api/internal/auth"
	"github.com/hasanwirayuda/schomora/api/internal/certificate"
	"github.com/hasanwirayuda/schomora/api/internal/course"
	"github.com/hasanwirayuda/schomora/api/internal/enrollment"
	"github.com/hasanwirayuda/schomora/api/internal/gamification"
	"github.com/hasanwirayuda/schomora/api/internal/models"
	"github.com/hasanwirayuda/schomora/api/internal/progress"
	"github.com/hasanwirayuda/schomora/api/internal/quiz"
	"github.com/hasanwirayuda/schomora/api/pkg/database"
	"github.com/hasanwirayuda/schomora/api/pkg/middleware"
	"github.com/joho/godotenv"
)

func main() {
    if err := godotenv.Load(); err != nil {
        log.Fatal("Error loading .env file")
    }

    database.Connect()
    database.ConnectRedis()

    database.DB.AutoMigrate(
        &models.User{},
        &models.Course{},
        &models.Module{},
        &models.Enrollment{},
        &models.Question{},
        &models.Quiz{},
        &models.QuizAttempt{},
        &models.AttemptAnswer{},
        &models.ModuleProgress{},
        &models.Badge{},
        &models.UserBadge{},
        &models.Certificate{},
    )

    r := gin.Default()

    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "ok", "service": "schomora-api"})
    })

    authMiddleware := middleware.AuthMiddleware()

    // Auth
    authRepo := auth.NewRepository(database.DB)
    authService := auth.NewService(authRepo)
    authHandler := auth.NewHandler(authService)
    auth.RegisterRoutes(r, authHandler, authMiddleware)

    // Course
    courseRepo := course.NewRepository(database.DB)
    courseService := course.NewService(courseRepo)
    courseHandler := course.NewHandler(courseService)
    course.RegisterRoutes(r, courseHandler, authMiddleware)

    // Enrollment
    enrollmentRepo := enrollment.NewRepository(database.DB)
    enrollmentService := enrollment.NewService(enrollmentRepo, courseRepo)
    enrollmentHandler := enrollment.NewHandler(enrollmentService)
    enrollment.RegisterRoutes(r, enrollmentHandler, authMiddleware)

    // Gamification
    gamifRepo := gamification.NewRepository(database.DB, database.Redis)
    gamifService := gamification.NewService(gamifRepo)
    gamifService.SeedBadges()
    gamifHandler := gamification.NewHandler(gamifService)
    gamification.RegisterRoutes(r, gamifHandler, authMiddleware)

    // Quiz
    quizRepo := quiz.NewRepository(database.DB)
    quizService := quiz.NewService(quizRepo, courseRepo, courseRepo, gamification.NewQuizXPAdapter(gamifService))
    quizHandler := quiz.NewHandler(quizService)
    quiz.RegisterRoutes(r, quizHandler, authMiddleware)

    // Progress
    progressRepo := progress.NewRepository(database.DB)
    progressService := progress.NewService(
        progressRepo,
        courseRepo,
        courseRepo,
        enrollmentRepo,
        quizRepo,
        quizRepo,
    )
    progressHandler := progress.NewHandler(progressService)
    progress.RegisterRoutes(r, progressHandler, authMiddleware)

    // Certificate
    certRepo := certificate.NewRepository(database.DB)
    certService := certificate.NewService(
        certRepo,
        courseRepo,
        courseRepo,
        progressRepo,
        quizRepo,
        quizRepo,
        gamifRepo,
    )
    certHandler := certificate.NewHandler(certService)
    certificate.RegisterRoutes(r, certHandler, authMiddleware)

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    log.Printf("Schomora API running on port %s", port)
    if err := r.Run(":" + port); err != nil {
        log.Fatal(err)
    }
}