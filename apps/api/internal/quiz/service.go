package quiz

import (
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/hasanwirayuda/schomora/api/internal/models"
)

type QuestionOption struct {
    ID        string `json:"id"`
    Text      string `json:"text"`
    IsCorrect bool   `json:"is_correct"`
}

type CreateQuestionInput struct {
    TopicTag    string           `json:"topic_tag" binding:"required"`
    Difficulty  float64          `json:"difficulty" binding:"required,min=0,max=1"`
    Type        string           `json:"type" binding:"required"`
    Body        string           `json:"body" binding:"required"`
    Options     []QuestionOption `json:"options" binding:"required,min=2"`
    Explanation string           `json:"explanation"`
}

type CreateQuizInput struct {
    Title       string `json:"title" binding:"required"`
    Description string `json:"description"`
    TimeLimit   int    `json:"time_limit"`
}

type SubmitAnswerInput struct {
    QuestionID  string `json:"question_id" binding:"required"`
    Answer      string `json:"answer" binding:"required"`
    TimeSpentMs int    `json:"time_spent_ms"`
}

type SubmitQuizInput struct {
    Answers []SubmitAnswerInput `json:"answers" binding:"required,min=1"`
}

type Service interface {
    // Question
    CreateQuestion(courseID string, input CreateQuestionInput, userID uuid.UUID) (*models.Question, error)
    GetQuestionsByCourse(courseID string) ([]models.Question, error)
    DeleteQuestion(questionID string, userID uuid.UUID) error

    // Quiz
    CreateQuiz(moduleID string, input CreateQuizInput, userID uuid.UUID) (*models.Quiz, error)
    GetQuizByModule(moduleID string) (*models.Quiz, error)

    // Attempt
    StartQuiz(quizID string, userID uuid.UUID) (*models.QuizAttempt, []models.Question, error)
    SubmitQuiz(attemptID string, input SubmitQuizInput, userID uuid.UUID) (*models.QuizAttempt, error)
    GetAttemptResult(attemptID string, userID uuid.UUID) (*models.QuizAttempt, error)
    GetMyAttempts(quizID string, userID uuid.UUID) ([]models.QuizAttempt, error)
}

type service struct {
    repo       Repository
    courseRepo interface {
        FindCourseByID(id string) (*models.Course, error)
    }
    moduleRepo interface {
        FindModuleByID(id string) (*models.Module, error)
    }
}

func NewService(
    repo Repository,
    courseRepo interface{ FindCourseByID(id string) (*models.Course, error) },
    moduleRepo interface{ FindModuleByID(id string) (*models.Module, error) },
) Service {
    return &service{repo, courseRepo, moduleRepo}
}

func (s *service) CreateQuestion(courseID string, input CreateQuestionInput, userID uuid.UUID) (*models.Question, error) {
    course, err := s.courseRepo.FindCourseByID(courseID)
    if err != nil {
        return nil, errors.New("course not found")
    }

    if course.AuthorID != userID {
        return nil, errors.New("unauthorized: only the course author can add questions")
    }

    optionsJSON, err := json.Marshal(input.Options)
    if err != nil {
        return nil, errors.New("invalid options format")
    }

    question := &models.Question{
        CourseID:    course.ID,
        TopicTag:    input.TopicTag,
        Difficulty:  input.Difficulty,
        Type:        models.QuestionType(input.Type),
        Body:        input.Body,
        Options:     string(optionsJSON),
        Explanation: input.Explanation,
    }

    if err := s.repo.CreateQuestion(question); err != nil {
        return nil, errors.New("failed to create question")
    }

    return question, nil
}

func (s *service) GetQuestionsByCourse(courseID string) ([]models.Question, error) {
    return s.repo.FindQuestionsByCourseID(courseID)
}

func (s *service) DeleteQuestion(questionID string, userID uuid.UUID) error {
    question, err := s.repo.FindQuestionByID(questionID)
    if err != nil {
        return errors.New("question not found")
    }

    course, err := s.courseRepo.FindCourseByID(question.CourseID.String())
    if err != nil {
        return errors.New("course not found")
    }

    if course.AuthorID != userID {
        return errors.New("unauthorized")
    }

    return s.repo.DeleteQuestion(questionID)
}

func (s *service) CreateQuiz(moduleID string, input CreateQuizInput, userID uuid.UUID) (*models.Quiz, error) {
    module, err := s.moduleRepo.FindModuleByID(moduleID)
    if err != nil {
        return nil, errors.New("module not found")
    }

    course, err := s.courseRepo.FindCourseByID(module.CourseID.String())
    if err != nil {
        return nil, errors.New("course not found")
    }

    if course.AuthorID != userID {
        return nil, errors.New("unauthorized: only the course author can create a quiz")
    }

    // Cek sudah ada quiz di modul ini belum
    existing, _ := s.repo.FindQuizByModuleID(moduleID)
    if existing != nil {
        return nil, errors.New("this module already has a quiz")
    }

    moduleUUID, _ := uuid.Parse(moduleID)
    quiz := &models.Quiz{
        ModuleID:    moduleUUID,
        Title:       input.Title,
        Description: input.Description,
        TimeLimit:   input.TimeLimit,
    }

    if err := s.repo.CreateQuiz(quiz); err != nil {
        return nil, errors.New("failed to create quiz")
    }

    return quiz, nil
}

func (s *service) GetQuizByModule(moduleID string) (*models.Quiz, error) {
    quiz, err := s.repo.FindQuizByModuleID(moduleID)
    if err != nil {
        return nil, errors.New("quiz not found")
    }
    return quiz, nil
}

func (s *service) StartQuiz(quizID string, userID uuid.UUID) (*models.QuizAttempt, []models.Question, error) {
    quiz, err := s.repo.FindQuizByID(quizID)
    if err != nil {
        return nil, nil, errors.New("quiz not found")
    }

    // Ambil semua soal dari course yang terkait modul ini
    module, err := s.moduleRepo.FindModuleByID(quiz.ModuleID.String())
    if err != nil {
        return nil, nil, errors.New("module not found")
    }

    questions, err := s.repo.FindQuestionsByCourseID(module.CourseID.String())
    if err != nil || len(questions) == 0 {
        return nil, nil, errors.New("no questions available for this quiz")
    }

    quizUUID, _ := uuid.Parse(quizID)
    attempt := &models.QuizAttempt{
        UserID:          userID,
        QuizID:          quizUUID,
        AbilityEstimate: abilityDefault,
    }

    if err := s.repo.CreateAttempt(attempt); err != nil {
        return nil, nil, errors.New("failed to start quiz")
    }

    return attempt, questions, nil
}

func (s *service) SubmitQuiz(attemptID string, input SubmitQuizInput, userID uuid.UUID) (*models.QuizAttempt, error) {
    attempt, err := s.repo.FindAttemptByID(attemptID)
    if err != nil {
        return nil, errors.New("attempt not found")
    }

    if attempt.UserID != userID {
        return nil, errors.New("unauthorized")
    }

    if attempt.CompletedAt != nil {
        return nil, errors.New("this attempt has already been submitted")
    }

    // Ambil soal untuk validasi jawaban
    module, err := s.moduleRepo.FindModuleByID(attempt.Quiz.ModuleID.String())
    if err != nil {
        return nil, errors.New("module not found")
    }

    questions, err := s.repo.FindQuestionsByCourseID(module.CourseID.String())
    if err != nil {
        return nil, errors.New("failed to load questions")
    }

    // Map question by ID untuk lookup cepat
    questionMap := make(map[string]models.Question)
    for _, q := range questions {
        questionMap[q.ID.String()] = q
    }

    totalCorrect := 0
    currentAbility := attempt.AbilityEstimate

    for _, ans := range input.Answers {
        question, exists := questionMap[ans.QuestionID]
        if !exists {
            continue
        }

        // Parse options JSON untuk cek jawaban benar
        var options []QuestionOption
        json.Unmarshal([]byte(question.Options), &options)

        isCorrect := false
        for _, opt := range options {
            if opt.ID == ans.Answer && opt.IsCorrect {
                isCorrect = true
                break
            }
        }

        if isCorrect {
            totalCorrect++
        }

        // Update ability estimate per jawaban
        currentAbility = UpdateAbility(currentAbility, isCorrect, question.Difficulty)

        questionUUID, _ := uuid.Parse(ans.QuestionID)
        attemptUUID, _ := uuid.Parse(attemptID)

        answer := &models.AttemptAnswer{
            AttemptID:   attemptUUID,
            QuestionID:  questionUUID,
            Answer:      ans.Answer,
            IsCorrect:   isCorrect,
            TimeSpentMs: ans.TimeSpentMs,
        }

        s.repo.CreateAnswer(answer)
    }

    // Hitung skor final
    now := time.Now()
    attempt.Score = CalculateScore(totalCorrect, len(input.Answers))
    attempt.AbilityEstimate = currentAbility
    attempt.CompletedAt = &now

    if err := s.repo.UpdateAttempt(attempt); err != nil {
        return nil, errors.New("failed to save attempt result")
    }

    // Load ulang dengan answers
    return s.repo.FindAttemptByID(attemptID)
}

func (s *service) GetAttemptResult(attemptID string, userID uuid.UUID) (*models.QuizAttempt, error) {
    attempt, err := s.repo.FindAttemptByID(attemptID)
    if err != nil {
        return nil, errors.New("attempt not found")
    }

    if attempt.UserID != userID {
        return nil, errors.New("unauthorized")
    }

    return attempt, nil
}

func (s *service) GetMyAttempts(quizID string, userID uuid.UUID) ([]models.QuizAttempt, error) {
    quizUUID, err := uuid.Parse(quizID)
    if err != nil {
        return nil, errors.New("invalid quiz ID")
    }
    return s.repo.FindAttemptsByUserAndQuiz(userID, quizUUID)
}