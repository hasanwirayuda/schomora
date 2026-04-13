package quiz

import (
	"github.com/google/uuid"
	"github.com/hasanwirayuda/schomora/api/internal/models"
	"gorm.io/gorm"
)

type Repository interface {
    // Question
    CreateQuestion(q *models.Question) error
    FindQuestionsByCourseID(courseID string) ([]models.Question, error)
    FindQuestionByID(id string) (*models.Question, error)
    DeleteQuestion(id string) error

    // Quiz
    CreateQuiz(quiz *models.Quiz) error
    FindQuizByModuleID(moduleID string) (*models.Quiz, error)
    FindQuizByID(id string) (*models.Quiz, error)

    // Attempt
    CreateAttempt(attempt *models.QuizAttempt) error
    UpdateAttempt(attempt *models.QuizAttempt) error
    FindAttemptByID(id string) (*models.QuizAttempt, error)
    FindAttemptsByUserAndQuiz(userID, quizID uuid.UUID) ([]models.QuizAttempt, error)

    // Answer
    CreateAnswer(answer *models.AttemptAnswer) error
    FindAnswersByAttemptID(attemptID string) ([]models.AttemptAnswer, error)
}

type repository struct {
    db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
    return &repository{db}
}

func (r *repository) CreateQuestion(q *models.Question) error {
    return r.db.Create(q).Error
}

func (r *repository) FindQuestionsByCourseID(courseID string) ([]models.Question, error) {
    var questions []models.Question
    err := r.db.Where("course_id = ?", courseID).Find(&questions).Error
    return questions, err
}

func (r *repository) FindQuestionByID(id string) (*models.Question, error) {
    var question models.Question
    err := r.db.Where("id = ?", id).First(&question).Error
    if err != nil {
        return nil, err
    }
    return &question, nil
}

func (r *repository) DeleteQuestion(id string) error {
    return r.db.Where("id = ?", id).Delete(&models.Question{}).Error
}

func (r *repository) CreateQuiz(quiz *models.Quiz) error {
    return r.db.Create(quiz).Error
}

func (r *repository) FindQuizByModuleID(moduleID string) (*models.Quiz, error) {
    var quiz models.Quiz
    err := r.db.Where("module_id = ?", moduleID).First(&quiz).Error
    if err != nil {
        return nil, err
    }
    return &quiz, nil
}

func (r *repository) FindQuizByID(id string) (*models.Quiz, error) {
    var quiz models.Quiz
    err := r.db.Where("id = ?", id).First(&quiz).Error
    if err != nil {
        return nil, err
    }
    return &quiz, nil
}

func (r *repository) CreateAttempt(attempt *models.QuizAttempt) error {
    return r.db.Create(attempt).Error
}

func (r *repository) UpdateAttempt(attempt *models.QuizAttempt) error {
    return r.db.Model(&models.QuizAttempt{}).
        Where("id = ?", attempt.ID).
        Updates(map[string]interface{}{
            "score":            attempt.Score,
            "ability_estimate": attempt.AbilityEstimate,
            "completed_at":     attempt.CompletedAt,
        }).Error
}

func (r *repository) FindAttemptByID(id string) (*models.QuizAttempt, error) {
    var attempt models.QuizAttempt
    err := r.db.Preload("Quiz").Preload("Answers").Preload("Answers.Question").
        Where("id = ?", id).First(&attempt).Error
    if err != nil {
        return nil, err
    }
    return &attempt, nil
}

func (r *repository) FindAttemptsByUserAndQuiz(userID, quizID uuid.UUID) ([]models.QuizAttempt, error) {
    var attempts []models.QuizAttempt
    err := r.db.Where("user_id = ? AND quiz_id = ?", userID, quizID).
        Order("started_at desc").
        Find(&attempts).Error
    return attempts, err
}

func (r *repository) CreateAnswer(answer *models.AttemptAnswer) error {
    return r.db.Create(answer).Error
}

func (r *repository) FindAnswersByAttemptID(attemptID string) ([]models.AttemptAnswer, error) {
    var answers []models.AttemptAnswer
    err := r.db.Preload("Question").
        Where("attempt_id = ?", attemptID).
        Find(&answers).Error
    return answers, err
}