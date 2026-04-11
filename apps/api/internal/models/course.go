package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Course struct {
    ID          uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
    Title       string         `json:"title" gorm:"not null"`
    Description string         `json:"description"`
    Thumbnail   string         `json:"thumbnail"`
    AuthorID    uuid.UUID      `json:"author_id" gorm:"type:uuid;not null"`
    Author      User           `json:"author" gorm:"foreignKey:AuthorID"`
    Modules     []Module       `json:"modules,omitempty" gorm:"foreignKey:CourseID;constraint:OnDelete:CASCADE"`
    CreatedAt   time.Time      `json:"created_at"`
    UpdatedAt   time.Time      `json:"updated_at"`
    DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

type Module struct {
    ID          uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
    CourseID    uuid.UUID      `json:"course_id" gorm:"type:uuid;not null"`
    Title       string         `json:"title" gorm:"not null"`
    Description string         `json:"description"`
    Order       int            `json:"order" gorm:"not null;default:1"`
    ContentURL  string         `json:"content_url"`
    ContentType string         `json:"content_type" gorm:"type:varchar(20);default:'text'"`
    CreatedAt   time.Time      `json:"created_at"`
    UpdatedAt   time.Time      `json:"updated_at"`
    DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

func (c *Course) BeforeCreate(tx *gorm.DB) error {
    c.ID = uuid.New()
    return nil
}

func (m *Module) BeforeCreate(tx *gorm.DB) error {
    m.ID = uuid.New()
    return nil
}