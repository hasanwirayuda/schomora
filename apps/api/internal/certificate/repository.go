package certificate

import (
	"github.com/google/uuid"
	"github.com/hasanwirayuda/schomora/api/internal/models"
	"gorm.io/gorm"
)

type Repository interface {
    Create(cert *models.Certificate) error
    FindByID(id string) (*models.Certificate, error)
    FindByUserAndCourse(userID, courseID uuid.UUID) (*models.Certificate, error)
    FindByUserID(userID uuid.UUID) ([]models.Certificate, error)
}

type repository struct {
    db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
    return &repository{db}
}

func (r *repository) Create(cert *models.Certificate) error {
    return r.db.Create(cert).Error
}

func (r *repository) FindByID(id string) (*models.Certificate, error) {
    var cert models.Certificate
    err := r.db.Preload("User").Preload("Course").
        Where("id = ?", id).First(&cert).Error
    if err != nil {
        return nil, err
    }
    return &cert, nil
}

func (r *repository) FindByUserAndCourse(userID, courseID uuid.UUID) (*models.Certificate, error) {
    var cert models.Certificate
    err := r.db.Where("user_id = ? AND course_id = ?", userID, courseID).
        First(&cert).Error
    if err != nil {
        return nil, err
    }
    return &cert, nil
}

func (r *repository) FindByUserID(userID uuid.UUID) ([]models.Certificate, error) {
    var certs []models.Certificate
    err := r.db.Preload("User").Preload("Course").
        Where("user_id = ?", userID).
        Find(&certs).Error
    return certs, err
}