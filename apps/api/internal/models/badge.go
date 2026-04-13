package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Badge struct {
    ID          uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
    Code        string    `json:"code" gorm:"uniqueIndex;not null"`
    Name        string    `json:"name" gorm:"not null"`
    Description string    `json:"description"`
    Icon        string    `json:"icon"`
}

type UserBadge struct {
    ID        uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
    UserID    uuid.UUID `json:"user_id" gorm:"type:uuid;not null"`
    BadgeCode string    `json:"badge_code" gorm:"not null"`
    Badge     Badge     `json:"badge" gorm:"foreignKey:BadgeCode;references:Code"`
    EarnedAt  time.Time `json:"earned_at"`
}

func (b *Badge) BeforeCreate(tx *gorm.DB) error {
    b.ID = uuid.New()
    return nil
}

func (ub *UserBadge) BeforeCreate(tx *gorm.DB) error {
    ub.ID = uuid.New()
    ub.EarnedAt = time.Now()
    return nil
}