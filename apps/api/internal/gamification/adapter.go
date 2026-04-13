package gamification

import "github.com/google/uuid"

// QuizXPAdapter mengimplementasikan quiz.XPAwarder
type QuizXPAdapter struct {
    svc Service
}

func NewQuizXPAdapter(svc Service) *QuizXPAdapter {
    return &QuizXPAdapter{svc}
}

func (a *QuizXPAdapter) AwardQuizXP(userID uuid.UUID, score float64, isFirstAttempt bool) error {
    _, err := a.svc.AwardQuizXP(userID, score, isFirstAttempt)
    return err
}