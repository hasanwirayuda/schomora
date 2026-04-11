package enrollment

import (
	"github.com/google/uuid"
	"github.com/hasanwirayuda/schomora/api/internal/models"
	"gorm.io/gorm"
)

type Repository interface {
    Enroll(enrollment *models.Enrollment) error
    FindByUserIDAndCourseID(userID, courseID uuid.UUID) (*models.Enrollment, error)
    FindByUserID(userID uuid.UUID) ([]models.Enrollment, error)
    FindByCourseID(courseID uuid.UUID) ([]models.Enrollment, error)
}

type repository struct {
    db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
    return &repository{db}
}

func (r *repository) Enroll(enrollment *models.Enrollment) error {
    return r.db.Create(enrollment).Error
}

func (r *repository) FindByUserIDAndCourseID(userID, courseID uuid.UUID) (*models.Enrollment, error) {
    var enrollment models.Enrollment
    err := r.db.Where("user_id = ? AND course_id = ?", userID, courseID).
        First(&enrollment).Error
    if err != nil {
        return nil, err
    }
    return &enrollment, nil
}

func (r *repository) FindByUserID(userID uuid.UUID) ([]models.Enrollment, error) {
    var enrollments []models.Enrollment
    err := r.db.Preload("Course").Preload("Course.Author").
        Where("user_id = ?", userID).
        Find(&enrollments).Error
    return enrollments, err
}

func (r *repository) FindByCourseID(courseID uuid.UUID) ([]models.Enrollment, error) {
    var enrollments []models.Enrollment
    err := r.db.Preload("User").
        Where("course_id = ?", courseID).
        Find(&enrollments).Error
    return enrollments, err
}