package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/hasanwirayuda/schomora/api/internal/models"
	"github.com/hasanwirayuda/schomora/api/pkg/database"
)

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "missing or invalid token"})
            c.Abort()
            return
        }

        tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

        token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
            return []byte(os.Getenv("JWT_SECRET")), nil
        })

        if err != nil || !token.Valid {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
            c.Abort()
            return
        }

        claims, ok := token.Claims.(jwt.MapClaims)
        if !ok {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token claims"})
            c.Abort()
            return
        }

        // Ambil user dari database langsung tanpa import auth package
        userID := claims["user_id"].(string)
        var user models.User
        if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
            c.Abort()
            return
        }

        c.Set("currentUser", &user)
        c.Next()
    }
}