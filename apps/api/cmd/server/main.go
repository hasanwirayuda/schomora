package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/hasanwirayuda/schomora/api/pkg/database"
	"github.com/joho/godotenv"
)

func main() {
    if err := godotenv.Load(); err != nil {
        log.Fatal("Error loading .env file")
    }

    // Connect database
    database.Connect()

    r := gin.Default()

    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "status":  "ok",
            "service": "schomora-api",
        })
    })

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    log.Printf("Server running on port %s", port)
    if err := r.Run(":" + port); err != nil {
        log.Fatal(err)
    }
}