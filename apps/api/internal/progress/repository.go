package progress

import (
	"github.com/google/uuid"
	"github.com/hasanwirayuda/schomora/api/internal/models"
	"gorm.io/gorm"
)

type Repository interface {
    UpsertModuleProgress(progress *models.ModuleProgress) error
    FindByUserAndModule(userID, moduleID uuid.UUID) (*models.ModuleProgress, error)
    FindByUserAndCourse(userID, courseID uuid.UUID) ([]models.ModuleProgress, error)
    FindAllByUser(userID uuid.UUID) ([]models.ModuleProgress, error)
}

type repository struct {
    db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
    return &repository{db}
}

func (r *repository) UpsertModuleProgress(p *models.ModuleProgress) error {
    existing := &models.ModuleProgress{}
    err := r.db.Where("user_id = ? AND module_id = ?", p.UserID, p.ModuleID).
        First(existing).Error

    if err != nil {
        // Belum ada, create baru
        return r.db.Create(p).Error
    }

    // Sudah ada, update dan sync ID ke struct yang akan dikembalikan
    p.ID = existing.ID
    return r.db.Model(&models.ModuleProgress{}).
        Where("user_id = ? AND module_id = ?", p.UserID, p.ModuleID).
        Updates(map[string]interface{}{
            "is_completed": p.IsCompleted,
            "completed_at": p.CompletedAt,
        }).Error
}

func (r *repository) FindByUserAndModule(userID, moduleID uuid.UUID) (*models.ModuleProgress, error) {
    var progress models.ModuleProgress
    err := r.db.Preload("Module").
        Where("user_id = ? AND module_id = ?", userID, moduleID).
        First(&progress).Error
    if err != nil {
        return nil, err
    }
    return &progress, nil
}

func (r *repository) FindByUserAndCourse(userID, courseID uuid.UUID) ([]models.ModuleProgress, error) {
    var progresses []models.ModuleProgress
    err := r.db.Preload("Module").
        Where("user_id = ? AND course_id = ?", userID, courseID).
        Find(&progresses).Error
    return progresses, err
}

func (r *repository) FindAllByUser(userID uuid.UUID) ([]models.ModuleProgress, error) {
    var progresses []models.ModuleProgress
    err := r.db.Where("user_id = ?", userID).
        Find(&progresses).Error
    return progresses, err
}