package certificate

import (
	"errors"
	"math"

	"github.com/google/uuid"
	"github.com/hasanwirayuda/schomora/api/internal/models"
)

type Service interface {
    GenerateCertificate(userID uuid.UUID, courseID string) (*models.Certificate, []byte, error)
    GetCertificateByID(id string) (*models.Certificate, error)
    GetMyCertificates(userID uuid.UUID) ([]models.Certificate, error)
    DownloadCertificate(id string, userID uuid.UUID) (*models.Certificate, []byte, error)
    VerifyCertificate(id string) (*models.Certificate, error)
}

type service struct {
    repo        Repository
    courseRepo  interface {
        FindCourseByID(id string) (*models.Course, error)
    }
    moduleRepo  interface {
        FindModulesByCourseID(courseID string) ([]models.Module, error)
    }
    progressRepo interface {
        FindByUserAndCourse(userID, courseID uuid.UUID) ([]models.ModuleProgress, error)
    }
    quizRepo interface {
        FindQuizByModuleID(moduleID string) (*models.Quiz, error)
    }
    attemptRepo interface {
        FindAttemptsByUserAndQuiz(userID, quizID uuid.UUID) ([]models.QuizAttempt, error)
    }
    gamifRepo interface {
        AwardBadge(userID uuid.UUID, code string) error
    }
}

func NewService(
    repo Repository,
    courseRepo interface{ FindCourseByID(id string) (*models.Course, error) },
    moduleRepo interface{ FindModulesByCourseID(courseID string) ([]models.Module, error) },
    progressRepo interface {
        FindByUserAndCourse(userID, courseID uuid.UUID) ([]models.ModuleProgress, error)
    },
    quizRepo interface{ FindQuizByModuleID(moduleID string) (*models.Quiz, error) },
    attemptRepo interface {
        FindAttemptsByUserAndQuiz(userID, quizID uuid.UUID) ([]models.QuizAttempt, error)
    },
    gamifRepo interface{ AwardBadge(userID uuid.UUID, code string) error },
) Service {
    return &service{repo, courseRepo, moduleRepo, progressRepo, quizRepo, attemptRepo, gamifRepo}
}

func (s *service) GenerateCertificate(userID uuid.UUID, courseID string) (*models.Certificate, []byte, error) {
    // Cek sudah punya sertifikat
    courseUUID, _ := uuid.Parse(courseID)
    existing, _ := s.repo.FindByUserAndCourse(userID, courseUUID)
    if existing != nil {
        // Sudah ada, generate ulang PDF saja
        pdf, err := s.generatePDF(existing)
        if err != nil {
            return nil, nil, err
        }
        return existing, pdf, nil
    }

    course, err := s.courseRepo.FindCourseByID(courseID)
    if err != nil {
        return nil, nil, errors.New("course not found")
    }

    // Validasi semua modul selesai
    modules, err := s.moduleRepo.FindModulesByCourseID(courseID)
    if err != nil || len(modules) == 0 {
        return nil, nil, errors.New("no modules found in this course")
    }

    progresses, err := s.progressRepo.FindByUserAndCourse(userID, courseUUID)
    if err != nil {
        return nil, nil, errors.New("failed to load progress")
    }

    completedMap := make(map[string]bool)
    for _, p := range progresses {
        if p.IsCompleted {
            completedMap[p.ModuleID.String()] = true
        }
    }

    for _, m := range modules {
        if !completedMap[m.ID.String()] {
            return nil, nil, errors.New("you must complete all modules before getting a certificate")
        }
    }

    // Hitung rata-rata skor quiz
    totalScore := 0.0
    quizCount := 0

    for _, module := range modules {
        quiz, err := s.quizRepo.FindQuizByModuleID(module.ID.String())
        if err != nil {
            continue
        }

        attempts, err := s.attemptRepo.FindAttemptsByUserAndQuiz(userID, quiz.ID)
        if err != nil || len(attempts) == 0 {
            continue
        }

        // Ambil skor tertinggi dari semua attempt
        bestScore := 0.0
        for _, a := range attempts {
            if a.Score > bestScore {
                bestScore = a.Score
            }
        }

        totalScore += bestScore
        quizCount++
    }

    averageScore := 0.0
    if quizCount > 0 {
        averageScore = math.Round(totalScore / float64(quizCount))
    }

    if averageScore < 70 {
        return nil, nil, errors.New("minimum average score of 70% required to get a certificate")
    }

    cert := &models.Certificate{
        UserID:       userID,
        CourseID:     course.ID,
        AverageScore: averageScore,
    }

    if err := s.repo.Create(cert); err != nil {
        return nil, nil, errors.New("failed to create certificate")
    }

    // Load relasi
    cert.Course = *course

    // Award badge course complete
    s.gamifRepo.AwardBadge(userID, "course_complete")

    pdf, err := s.generatePDF(cert)
    if err != nil {
        return nil, nil, errors.New("failed to generate PDF")
    }

    return cert, pdf, nil
}

func (s *service) generatePDF(cert *models.Certificate) ([]byte, error) {
    data := CertificateData{
        ID:           cert.ID.String(),
        StudentName:  cert.User.Name,
        CourseName:   cert.Course.Title,
        AverageScore: cert.AverageScore,
        IssuedAt:     cert.IssuedAt,
    }

    // Load user & course jika belum ter-load
    if data.StudentName == "" || data.CourseName == "" {
        full, err := s.repo.FindByID(cert.ID.String())
        if err == nil {
            data.StudentName = full.User.Name
            data.CourseName = full.Course.Title
        }
    }

    return GeneratePDF(data)
}

func (s *service) GetCertificateByID(id string) (*models.Certificate, error) {
    cert, err := s.repo.FindByID(id)
    if err != nil {
        return nil, errors.New("certificate not found")
    }
    return cert, nil
}

func (s *service) GetMyCertificates(userID uuid.UUID) ([]models.Certificate, error) {
    return s.repo.FindByUserID(userID)
}

func (s *service) DownloadCertificate(id string, userID uuid.UUID) (*models.Certificate, []byte, error) {
    cert, err := s.repo.FindByID(id)
    if err != nil {
        return nil, nil, errors.New("certificate not found")
    }

    if cert.UserID != userID {
        return nil, nil, errors.New("unauthorized")
    }

    pdf, err := s.generatePDF(cert)
    if err != nil {
        return nil, nil, errors.New("failed to generate PDF")
    }

    return cert, pdf, nil
}

func (s *service) VerifyCertificate(id string) (*models.Certificate, error) {
    cert, err := s.repo.FindByID(id)
    if err != nil {
        return nil, errors.New("certificate not found or invalid")
    }
    return cert, nil
}