package course

import (
	"github.com/hasanwirayuda/schomora/api/internal/models"
	"gorm.io/gorm"
)

type Repository interface {
    // Course
    CreateCourse(course *models.Course) error
    FindAllCourses() ([]models.Course, error)
    FindCourseByID(id string) (*models.Course, error)
    UpdateCourse(course *models.Course) error
    DeleteCourse(id string) error

    // Module
    CreateModule(module *models.Module) error
    FindModulesByCourseID(courseID string) ([]models.Module, error)
    FindModuleByID(id string) (*models.Module, error)
    UpdateModule(module *models.Module) error
    DeleteModule(id string) error
}

type repository struct {
    db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
    return &repository{db}
}

// ── Course ──────────────────────────────────────────

func (r *repository) CreateCourse(course *models.Course) error {
    return r.db.Create(course).Error
}

func (r *repository) FindAllCourses() ([]models.Course, error) {
    var courses []models.Course
    err := r.db.Preload("Author").Find(&courses).Error
    return courses, err
}

func (r *repository) FindCourseByID(id string) (*models.Course, error) {
    var course models.Course
    err := r.db.Preload("Author").Preload("Modules").
        Where("id = ?", id).First(&course).Error
    if err != nil {
        return nil, err
    }
    return &course, nil
}

func (r *repository) UpdateCourse(course *models.Course) error {
    return r.db.Model(&models.Course{}).
        Where("id = ?", course.ID).
        Updates(map[string]interface{}{
            "title":       course.Title,
            "description": course.Description,
            "thumbnail":   course.Thumbnail,
        }).Error
}

func (r *repository) DeleteCourse(id string) error {
    return r.db.Where("id = ?", id).Delete(&models.Course{}).Error
}

// ── Module ──────────────────────────────────────────

func (r *repository) CreateModule(module *models.Module) error {
    return r.db.Create(module).Error
}

func (r *repository) FindModulesByCourseID(courseID string) ([]models.Module, error) {
    var modules []models.Module
    err := r.db.Where("course_id = ?", courseID).
        Order(`"order" asc`).Find(&modules).Error
    return modules, err
}

func (r *repository) FindModuleByID(id string) (*models.Module, error) {
    var module models.Module
    err := r.db.Where("id = ?", id).First(&module).Error
    if err != nil {
        return nil, err
    }
    return &module, nil
}

func (r *repository) UpdateModule(module *models.Module) error {
    return r.db.Model(&models.Module{}).
        Where("id = ?", module.ID).
        Updates(map[string]interface{}{
            "title":        module.Title,
            "description":  module.Description,
            "content_url":  module.ContentURL,
            "content_type": module.ContentType,
        }).Error
}

func (r *repository) DeleteModule(id string) error {
    return r.db.Where("id = ?", id).Delete(&models.Module{}).Error
}