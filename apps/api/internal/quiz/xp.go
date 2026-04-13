package quiz

import "github.com/google/uuid"

// XPAwarder adalah interface untuk menghindari circular import
// antara quiz dan gamification package
type XPAwarder interface {
    AwardQuizXP(userID uuid.UUID, score float64, isFirstAttempt bool) error
}