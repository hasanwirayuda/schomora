package progress

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/hasanwirayuda/schomora/api/internal/models"
)

type CourseProgressSummary struct {
    CourseID        uuid.UUID `json:"course_id"`
    CourseTitle     string    `json:"course_title"`
    TotalModules    int       `json:"total_modules"`
    CompletedModules int      `json:"completed_modules"`
    ProgressPercent float64   `json:"progress_percent"`
    IsCompleted     bool      `json:"is_completed"`
}

type SkillMapItem struct {
    TopicTag       string  `json:"topic_tag"`
    TotalAnswered  int     `json:"total_answered"`
    TotalCorrect   int     `json:"total_correct"`
    AccuracyPercent float64 `json:"accuracy_percent"`
    Level          string  `json:"level"`
}

type DashboardSummary struct {
    TotalEnrolled    int                     `json:"total_enrolled"`
    TotalCompleted   int                     `json:"total_completed"`
    CurrentStreak    int                     `json:"current_streak"`
    XPTotal          int                     `json:"xp_total"`
    CourseProgresses []CourseProgressSummary `json:"course_progresses"`
    SkillMap         []SkillMapItem          `json:"skill_map"`
}

type Service interface {
    MarkModuleComplete(userID uuid.UUID, moduleID string) (*models.ModuleProgress, error)
    GetCourseProgress(userID uuid.UUID, courseID string) (*CourseProgressSummary, error)
    GetSkillMap(userID uuid.UUID, courseID string) ([]SkillMapItem, error)
    GetDashboard(userID uuid.UUID) (*DashboardSummary, error)
}

type service struct {
    repo        Repository
    courseRepo  interface {
        FindCourseByID(id string) (*models.Course, error)
        FindAllCourses() ([]models.Course, error)
    }
    moduleRepo  interface {
        FindModuleByID(id string) (*models.Module, error)
        FindModulesByCourseID(courseID string) ([]models.Module, error)
    }
    enrollRepo  interface {
        FindByUserID(userID uuid.UUID) ([]models.Enrollment, error)
    }
    attemptRepo interface {
        FindAnswersByAttemptID(attemptID string) ([]models.AttemptAnswer, error)
        FindAttemptsByUserAndQuiz(userID, quizID uuid.UUID) ([]models.QuizAttempt, error)
    }
    quizRepo interface {
        FindQuizByModuleID(moduleID string) (*models.Quiz, error)
    }
}

func NewService(
    repo Repository,
    courseRepo interface {
        FindCourseByID(id string) (*models.Course, error)
        FindAllCourses() ([]models.Course, error)
    },
    moduleRepo interface {
        FindModuleByID(id string) (*models.Module, error)
        FindModulesByCourseID(courseID string) ([]models.Module, error)
    },
    enrollRepo interface {
        FindByUserID(userID uuid.UUID) ([]models.Enrollment, error)
    },
    attemptRepo interface {
        FindAnswersByAttemptID(attemptID string) ([]models.AttemptAnswer, error)
        FindAttemptsByUserAndQuiz(userID, quizID uuid.UUID) ([]models.QuizAttempt, error)
    },
    quizRepo interface {
        FindQuizByModuleID(moduleID string) (*models.Quiz, error)
    },
) Service {
    return &service{repo, courseRepo, moduleRepo, enrollRepo, attemptRepo, quizRepo}
}

func (s *service) MarkModuleComplete(userID uuid.UUID, moduleID string) (*models.ModuleProgress, error) {
    module, err := s.moduleRepo.FindModuleByID(moduleID)
    if err != nil {
        return nil, errors.New("module not found")
    }

    now := time.Now()
    moduleUUID, _ := uuid.Parse(moduleID)

    p := &models.ModuleProgress{
        UserID:      userID,
        ModuleID:    moduleUUID,
        CourseID:    module.CourseID,
        IsCompleted: true,
        CompletedAt: &now,
    }

    if err := s.repo.UpsertModuleProgress(p); err != nil {
        return nil, errors.New("failed to mark module as complete")
    }

    // Load ulang dengan relasi Module
    result, err := s.repo.FindByUserAndModule(userID, moduleUUID)
    if err != nil {
        return nil, errors.New("failed to load progress")
    }

    return result, nil
}

func (s *service) GetCourseProgress(userID uuid.UUID, courseID string) (*CourseProgressSummary, error) {
    course, err := s.courseRepo.FindCourseByID(courseID)
    if err != nil {
        return nil, errors.New("course not found")
    }

    modules, err := s.moduleRepo.FindModulesByCourseID(courseID)
    if err != nil {
        return nil, errors.New("failed to load modules")
    }

    courseUUID, _ := uuid.Parse(courseID)
    progresses, err := s.repo.FindByUserAndCourse(userID, courseUUID)
    if err != nil {
        return nil, errors.New("failed to load progress")
    }

    completedMap := make(map[string]bool)
    for _, p := range progresses {
        if p.IsCompleted {
            completedMap[p.ModuleID.String()] = true
        }
    }

    completedCount := 0
    for _, m := range modules {
        if completedMap[m.ID.String()] {
            completedCount++
        }
    }

    totalModules := len(modules)
    progressPercent := 0.0
    if totalModules > 0 {
        progressPercent = float64(completedCount) / float64(totalModules) * 100
    }

    return &CourseProgressSummary{
        CourseID:         course.ID,
        CourseTitle:      course.Title,
        TotalModules:     totalModules,
        CompletedModules: completedCount,
        ProgressPercent:  progressPercent,
        IsCompleted:      completedCount == totalModules && totalModules > 0,
    }, nil
}

func (s *service) GetSkillMap(userID uuid.UUID, courseID string) ([]SkillMapItem, error) {
    modules, err := s.moduleRepo.FindModulesByCourseID(courseID)
    if err != nil {
        return nil, errors.New("failed to load modules")
    }

    // Kumpulkan semua jawaban dari semua attempt di kursus ini
    topicStats := make(map[string]*SkillMapItem)

    for _, module := range modules {
        quiz, err := s.quizRepo.FindQuizByModuleID(module.ID.String())
        if err != nil {
            continue
        }

        attempts, err := s.attemptRepo.FindAttemptsByUserAndQuiz(userID, quiz.ID)
        if err != nil || len(attempts) == 0 {
            continue
        }

        // Ambil attempt terakhir saja
        lastAttempt := attempts[0]
        answers, err := s.attemptRepo.FindAnswersByAttemptID(lastAttempt.ID.String())
        if err != nil {
            continue
        }

        for _, answer := range answers {
            tag := answer.Question.TopicTag
            if _, exists := topicStats[tag]; !exists {
                topicStats[tag] = &SkillMapItem{TopicTag: tag}
            }
            topicStats[tag].TotalAnswered++
            if answer.IsCorrect {
                topicStats[tag].TotalCorrect++
            }
        }
    }

    // Hitung akurasi dan level per topik
    var result []SkillMapItem
    for _, item := range topicStats {
        if item.TotalAnswered > 0 {
            item.AccuracyPercent = float64(item.TotalCorrect) / float64(item.TotalAnswered) * 100
        }
        item.Level = skillLevel(item.AccuracyPercent)
        result = append(result, *item)
    }

    return result, nil
}

func skillLevel(accuracy float64) string {
    switch {
    case accuracy >= 80:
        return "strong"
    case accuracy >= 60:
        return "moderate"
    default:
        return "weak"
    }
}

func (s *service) GetDashboard(userID uuid.UUID) (*DashboardSummary, error) {
    enrollments, err := s.enrollRepo.FindByUserID(userID)
    if err != nil {
        return nil, errors.New("failed to load enrollments")
    }

    var courseProgresses []CourseProgressSummary
    totalCompleted := 0

    for _, enrollment := range enrollments {
        summary, err := s.GetCourseProgress(userID, enrollment.CourseID.String())
        if err != nil {
            continue
        }
        courseProgresses = append(courseProgresses, *summary)
        if summary.IsCompleted {
            totalCompleted++
        }
    }

    return &DashboardSummary{
        TotalEnrolled:    len(enrollments),
        TotalCompleted:   totalCompleted,
        CourseProgresses: courseProgresses,
    }, nil
}