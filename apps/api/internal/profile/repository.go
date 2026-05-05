package profile

import (
	"github.com/google/uuid"
	"github.com/hasanwirayuda/schomora/api/internal/models"
	"gorm.io/gorm"
)

type Repository interface {
    FindByID(id uuid.UUID) (*models.User, error)
    UpdateProfile(id uuid.UUID, updates map[string]interface{}) error
}

type repository struct {
    db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
    return &repository{db}
}

func (r *repository) FindByID(id uuid.UUID) (*models.User, error) {
    var user models.User
    err := r.db.Where("id = ?", id).First(&user).Error
    if err != nil {
        return nil, err
    }
    return &user, nil
}

func (r *repository) UpdateProfile(id uuid.UUID, updates map[string]interface{}) error {
    return r.db.Model(&models.User{}).
        Where("id = ?", id).
        Updates(updates).Error
}