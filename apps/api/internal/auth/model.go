package auth

import "github.com/hasanwirayuda/schomora/api/internal/models"

type User = models.User
type Role = models.Role

const (
    RoleStudent = models.RoleStudent
    RoleTeacher = models.RoleTeacher
    RoleAdmin   = models.RoleAdmin
)