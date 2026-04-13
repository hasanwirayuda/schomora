package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type QuestionType string

const (
    QuestionTypeMultipleChoice QuestionType = "multiple_choice"
    QuestionTypeTrueFalse      QuestionType = "true_false"
)

type Question struct {
    ID          uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
    CourseID    uuid.UUID      `json:"course_id" gorm:"type:uuid;not null"`
    Course      Course         `json:"-" gorm:"foreignKey:CourseID"`
    TopicTag    string         `json:"topic_tag" gorm:"not null"`
    Difficulty  float64        `json:"difficulty" gorm:"not null;default:0.5"`
    Type        QuestionType   `json:"type" gorm:"type:varchar(20);not null"`
    Body        string         `json:"body" gorm:"not null"`
    Options     string         `json:"options" gorm:"type:jsonb;not null"`
    Explanation string         `json:"explanation"`
    CreatedAt   time.Time      `json:"created_at"`
    UpdatedAt   time.Time      `json:"updated_at"`
    DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

type Quiz struct {
    ID          uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
    ModuleID    uuid.UUID      `json:"module_id" gorm:"type:uuid;not null;uniqueIndex"`
    Module      Module         `json:"-" gorm:"foreignKey:ModuleID"`
    Title       string         `json:"title" gorm:"not null"`
    Description string         `json:"description"`
    TimeLimit   int            `json:"time_limit" gorm:"default:0"`
    CreatedAt   time.Time      `json:"created_at"`
    UpdatedAt   time.Time      `json:"updated_at"`
    DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

type QuizAttempt struct {
    ID              uuid.UUID       `json:"id" gorm:"type:uuid;primaryKey"`
    UserID          uuid.UUID       `json:"user_id" gorm:"type:uuid;not null"`
    User            User            `json:"-" gorm:"foreignKey:UserID"`
    QuizID          uuid.UUID       `json:"quiz_id" gorm:"type:uuid;not null"`
    Quiz            Quiz            `json:"-" gorm:"foreignKey:QuizID"`
    Score           float64         `json:"score" gorm:"default:0"`
    AbilityEstimate float64         `json:"ability_estimate" gorm:"default:0.5"`
    StartedAt       time.Time       `json:"started_at"`
    CompletedAt     *time.Time      `json:"completed_at"`
    Answers         []AttemptAnswer `json:"answers,omitempty" gorm:"foreignKey:AttemptID;constraint:OnDelete:CASCADE"`
}

type AttemptAnswer struct {
    ID         uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
    AttemptID  uuid.UUID `json:"attempt_id" gorm:"type:uuid;not null"`
    QuestionID uuid.UUID `json:"question_id" gorm:"type:uuid;not null"`
    Question   Question  `json:"question,omitempty" gorm:"foreignKey:QuestionID"`
    Answer     string    `json:"answer" gorm:"not null"`
    IsCorrect  bool      `json:"is_correct" gorm:"default:false"`
    TimeSpentMs int      `json:"time_spent_ms" gorm:"default:0"`
}

func (q *Question) BeforeCreate(tx *gorm.DB) error {
    q.ID = uuid.New()
    return nil
}

func (q *Quiz) BeforeCreate(tx *gorm.DB) error {
    q.ID = uuid.New()
    return nil
}

func (qa *QuizAttempt) BeforeCreate(tx *gorm.DB) error {
    qa.ID = uuid.New()
    qa.StartedAt = time.Now()
    return nil
}

func (aa *AttemptAnswer) BeforeCreate(tx *gorm.DB) error {
    aa.ID = uuid.New()
    return nil
}