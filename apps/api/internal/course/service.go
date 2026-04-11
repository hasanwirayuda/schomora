package course

import (
	"errors"

	"github.com/google/uuid"
	"github.com/hasanwirayuda/schomora/api/internal/models"
)

type CreateCourseInput struct {
    Title       string `json:"title" binding:"required,min=3"`
    Description string `json:"description"`
    Thumbnail   string `json:"thumbnail"`
}

type UpdateCourseInput struct {
    Title       string `json:"title"`
    Description string `json:"description"`
    Thumbnail   string `json:"thumbnail"`
}

type CreateModuleInput struct {
    Title       string `json:"title" binding:"required,min=3"`
    Description string `json:"description"`
    Order       int    `json:"order" binding:"required,min=1"`
    ContentURL  string `json:"content_url"`
    ContentType string `json:"content_type"`
}

type UpdateModuleInput struct {
    Title       string `json:"title"`
    Description string `json:"description"`
    Order       int    `json:"order"`
    ContentURL  string `json:"content_url"`
    ContentType string `json:"content_type"`
}

type Service interface {
    // Course
    CreateCourse(input CreateCourseInput, authorID uuid.UUID) (*models.Course, error)
    GetAllCourses() ([]models.Course, error)
    GetCourseByID(id string) (*models.Course, error)
    UpdateCourse(id string, input UpdateCourseInput, userID uuid.UUID) (*models.Course, error)
    DeleteCourse(id string, userID uuid.UUID) error

    // Module
    CreateModule(courseID string, input CreateModuleInput, userID uuid.UUID) (*models.Module, error)
    GetModulesByCourseID(courseID string) ([]models.Module, error)
    UpdateModule(moduleID string, input UpdateModuleInput, userID uuid.UUID) (*models.Module, error)
    DeleteModule(moduleID string, userID uuid.UUID) error
}

type service struct {
    repo Repository
}

func NewService(repo Repository) Service {
    return &service{repo}
}

// ── Course ──────────────────────────────────────────

func (s *service) CreateCourse(input CreateCourseInput, authorID uuid.UUID) (*models.Course, error) {
    course := &models.Course{
        Title:       input.Title,
        Description: input.Description,
        Thumbnail:   input.Thumbnail,
        AuthorID:    authorID,
    }
    if err := s.repo.CreateCourse(course); err != nil {
        return nil, errors.New("failed to create course")
    }
    return course, nil
}

func (s *service) GetAllCourses() ([]models.Course, error) {
    return s.repo.FindAllCourses()
}

func (s *service) GetCourseByID(id string) (*models.Course, error) {
    course, err := s.repo.FindCourseByID(id)
    if err != nil {
        return nil, errors.New("course not found")
    }
    return course, nil
}

func (s *service) UpdateCourse(id string, input UpdateCourseInput, userID uuid.UUID) (*models.Course, error) {
    course, err := s.repo.FindCourseByID(id)
    if err != nil {
        return nil, errors.New("course not found")
    }

    if course.AuthorID != userID {
        return nil, errors.New("unauthorized: you are not the author")
    }

    if input.Title != "" {
        course.Title = input.Title
    }
    if input.Description != "" {
        course.Description = input.Description
    }
    if input.Thumbnail != "" {
        course.Thumbnail = input.Thumbnail
    }

    if err := s.repo.UpdateCourse(course); err != nil {
        return nil, errors.New("failed to update course")
    }
    return course, nil
}

func (s *service) DeleteCourse(id string, userID uuid.UUID) error {
    course, err := s.repo.FindCourseByID(id)
    if err != nil {
        return errors.New("course not found")
    }

    if course.AuthorID != userID {
        return errors.New("unauthorized: you are not the author")
    }

    return s.repo.DeleteCourse(id)
}

// ── Module ──────────────────────────────────────────

func (s *service) CreateModule(courseID string, input CreateModuleInput, userID uuid.UUID) (*models.Module, error) {
    course, err := s.repo.FindCourseByID(courseID)
    if err != nil {
        return nil, errors.New("course not found")
    }

    if course.AuthorID != userID {
        return nil, errors.New("unauthorized: you are not the author")
    }

    module := &models.Module{
        CourseID:    course.ID,
        Title:       input.Title,
        Description: input.Description,
        Order:       input.Order,
        ContentURL:  input.ContentURL,
        ContentType: input.ContentType,
    }

    if module.ContentType == "" {
        module.ContentType = "text"
    }

    if err := s.repo.CreateModule(module); err != nil {
        return nil, errors.New("failed to create module")
    }
    return module, nil
}

func (s *service) GetModulesByCourseID(courseID string) ([]models.Module, error) {
    return s.repo.FindModulesByCourseID(courseID)
}

func (s *service) UpdateModule(moduleID string, input UpdateModuleInput, userID uuid.UUID) (*models.Module, error) {
    module, err := s.repo.FindModuleByID(moduleID)
    if err != nil {
        return nil, errors.New("module not found")
    }

    course, err := s.repo.FindCourseByID(module.CourseID.String())
    if err != nil {
        return nil, errors.New("course not found")
    }

    if course.AuthorID != userID {
        return nil, errors.New("unauthorized: you are not the author")
    }

    if input.Title != "" {
        module.Title = input.Title
    }
    if input.Description != "" {
        module.Description = input.Description
    }
    if input.Order != 0 {
        module.Order = input.Order
    }
    if input.ContentURL != "" {
        module.ContentURL = input.ContentURL
    }
    if input.ContentType != "" {
        module.ContentType = input.ContentType
    }

    if err := s.repo.UpdateModule(module); err != nil {
        return nil, errors.New("failed to update module")
    }
    return module, nil
}

func (s *service) DeleteModule(moduleID string, userID uuid.UUID) error {
    module, err := s.repo.FindModuleByID(moduleID)
    if err != nil {
        return errors.New("module not found")
    }

    course, err := s.repo.FindCourseByID(module.CourseID.String())
    if err != nil {
        return errors.New("course not found")
    }

    if course.AuthorID != userID {
        return errors.New("unauthorized: you are not the author")
    }

    return s.repo.DeleteModule(moduleID)
}