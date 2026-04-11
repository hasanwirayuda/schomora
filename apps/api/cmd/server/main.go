package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/hasanwirayuda/schomora/api/internal/auth"
	"github.com/hasanwirayuda/schomora/api/internal/models"
	"github.com/hasanwirayuda/schomora/api/pkg/database"
	"github.com/hasanwirayuda/schomora/api/pkg/middleware"
	"github.com/joho/godotenv"
)

func main() {
    if err := godotenv.Load(); err != nil {
        log.Fatal("Error loading .env file")
    }

    database.Connect()

    // Auto migrate dari models package
    database.DB.AutoMigrate(&models.User{})

    r := gin.Default()

    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "status":  "ok",
            "service": "schomora-api",
        })
    })

    authRepo := auth.NewRepository(database.DB)
    authService := auth.NewService(authRepo)
    authHandler := auth.NewHandler(authService)
    auth.RegisterRoutes(r, authHandler, middleware.AuthMiddleware())

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    log.Printf("Schomora API running on port %s", port)
    if err := r.Run(":" + port); err != nil {
        log.Fatal(err)
    }
}