package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Enrollment struct {
    ID          uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey"`
    UserID      uuid.UUID  `json:"user_id" gorm:"type:uuid;not null"`
    CourseID    uuid.UUID  `json:"course_id" gorm:"type:uuid;not null"`
    User        User       `json:"user,omitempty" gorm:"foreignKey:UserID"`
    Course      Course     `json:"course,omitempty" gorm:"foreignKey:CourseID"`
    EnrolledAt  time.Time  `json:"enrolled_at"`
    CompletedAt *time.Time `json:"completed_at"`
}

func (e *Enrollment) BeforeCreate(tx *gorm.DB) error {
	e.ID = uuid.New()
	e.EnrolledAt = time.Now()
	return nil
}