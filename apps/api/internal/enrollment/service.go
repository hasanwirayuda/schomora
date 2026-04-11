package enrollment

import (
	"errors"

	"github.com/google/uuid"
	"github.com/hasanwirayuda/schomora/api/internal/models"
)

type Service interface {
    Enroll(userID uuid.UUID, courseID string) (*models.Enrollment, error)
    GetMyEnrollments(userID uuid.UUID) ([]models.Enrollment, error)
    GetCourseEnrollments(courseID string, userID uuid.UUID) ([]models.Enrollment, error)
}

type service struct {
    repo       Repository
    courseRepo interface {
        FindCourseByID(id string) (*models.Course, error)
    }
}

func NewService(repo Repository, courseRepo interface {
    FindCourseByID(id string) (*models.Course, error)
}) Service {
    return &service{repo, courseRepo}
}

func (s *service) Enroll(userID uuid.UUID, courseID string) (*models.Enrollment, error) {
    // Cek course ada
    course, err := s.courseRepo.FindCourseByID(courseID)
    if err != nil {
        return nil, errors.New("course not found")
    }

    // Cek sudah enroll atau belum
    existing, _ := s.repo.FindByUserIDAndCourseID(userID, course.ID)
    if existing != nil {
        return nil, errors.New("already enrolled in this course")
    }

    // Author tidak bisa enroll kursusnya sendiri
    if course.AuthorID == userID {
        return nil, errors.New("you cannot enroll in your own course")
    }

    enrollment := &models.Enrollment{
        UserID:   userID,
        CourseID: course.ID,
    }

    if err := s.repo.Enroll(enrollment); err != nil {
        return nil, errors.New("failed to enroll")
    }

    return enrollment, nil
}

func (s *service) GetMyEnrollments(userID uuid.UUID) ([]models.Enrollment, error) {
    return s.repo.FindByUserID(userID)
}

func (s *service) GetCourseEnrollments(courseID string, userID uuid.UUID) ([]models.Enrollment, error) {
    course, err := s.courseRepo.FindCourseByID(courseID)
    if err != nil {
        return nil, errors.New("course not found")
    }

    // Hanya author yang boleh lihat
    if course.AuthorID != userID {
        return nil, errors.New("unauthorized: only the course author can view enrollments")
    }

    enrollments, err := s.repo.FindByCourseID(course.ID)
    if err != nil {
        return nil, errors.New("failed to get enrollments")
    }

    return enrollments, nil
}