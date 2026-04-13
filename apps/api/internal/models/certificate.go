package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Certificate struct {
    ID           uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
    UserID       uuid.UUID `json:"user_id" gorm:"type:uuid;not null"`
    CourseID     uuid.UUID `json:"course_id" gorm:"type:uuid;not null"`
    User         User      `json:"user,omitempty" gorm:"foreignKey:UserID"`
    Course       Course    `json:"course,omitempty" gorm:"foreignKey:CourseID"`
    AverageScore float64   `json:"average_score"`
    IssuedAt     time.Time `json:"issued_at"`
}

func (c *Certificate) BeforeCreate(tx *gorm.DB) error {
    c.ID = uuid.New()
    c.IssuedAt = time.Now()
    return nil
}