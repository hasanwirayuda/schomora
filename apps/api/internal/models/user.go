package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Role string

const (
    RoleStudent Role = "student"
    RoleTeacher Role = "teacher"
    RoleAdmin   Role = "admin"
)

type User struct {
    ID           uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
    Name         string         `json:"name" gorm:"not null"`
    Email        string         `json:"email" gorm:"uniqueIndex;not null"`
    PasswordHash string         `json:"-" gorm:"not null"`
    Role         Role           `json:"role" gorm:"type:varchar(20);default:'student'"`
    XPTotal      int            `json:"xp_total" gorm:"default:0"`
    StreakDays   int            `json:"streak_days" gorm:"default:0"`
    CreatedAt    time.Time      `json:"created_at"`
    UpdatedAt    time.Time      `json:"updated_at"`
    DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
    u.ID = uuid.New()
    return nil
}