package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ModuleProgress struct {
    ID          uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey"`
    UserID      uuid.UUID  `json:"user_id" gorm:"type:uuid;not null"`
    ModuleID    uuid.UUID  `json:"module_id" gorm:"type:uuid;not null"`
    CourseID    uuid.UUID  `json:"course_id" gorm:"type:uuid;not null"`
    User        User       `json:"-" gorm:"foreignKey:UserID"`
    Module      Module     `json:"module,omitempty" gorm:"foreignKey:ModuleID"`
    IsCompleted bool       `json:"is_completed" gorm:"default:false"`
    CompletedAt *time.Time `json:"completed_at"`
}

func (mp *ModuleProgress) BeforeCreate(tx *gorm.DB) error {
    mp.ID = uuid.New()
    return nil
}