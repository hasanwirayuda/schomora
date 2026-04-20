package gamification

import (
	"errors"

	"github.com/google/uuid"
	"github.com/hasanwirayuda/schomora/api/internal/models"
)

// XP yang didapat per aktivitas
const (
    XPQuizComplete  = 10
    XPPerfectScore  = 25
    XPFirstQuiz     = 15
    XPModuleComplete = 5
)

// Daftar semua badge yang tersedia
var defaultBadges = []models.Badge{
    {Code: "first_quiz", Name: "First Quiz", Description: "Complete your first quiz", Icon: "🎯"},
    {Code: "perfect_score", Name: "Perfect Score", Description: "Get a score of 100 in a single quiz", Icon: "💯"},
    {Code: "top_10", Name: "Top 10", Description: "Rank in the top 10 of the leaderboard", Icon: "🏆"},
    {Code: "module_complete", Name: "Module Complete", Description: "Complete your first module", Icon: "📚"},
    {Code: "course_complete", Name: "Course Complete", Description: "Complete a full course", Icon: "🎓"},
}

type AwardXPResult struct {
    XPEarned    int      `json:"xp_earned"`
    TotalXP     int      `json:"total_xp"`
    Rank        int64    `json:"rank"`
    NewBadges   []string `json:"new_badges"`
}

type Service interface {
    SeedBadges() error
    AwardQuizXP(userID uuid.UUID, score float64, isFirstAttempt bool) (*AwardXPResult, error)
    AwardModuleXP(userID uuid.UUID) (*AwardXPResult, error)
    GetLeaderboard(limit int) ([]LeaderboardEntry, error)
    GetMyRank(userID uuid.UUID) (int64, int, error)
    GetMyBadges(userID uuid.UUID) ([]models.UserBadge, error)
}

type service struct {
    repo Repository
}

func NewService(repo Repository) Service {
    return &service{repo}
}

func (s *service) SeedBadges() error {
    return s.repo.SeedBadges(defaultBadges)
}

func (s *service) AwardQuizXP(userID uuid.UUID, score float64, isFirstAttempt bool) (*AwardXPResult, error) {
    xpEarned := XPQuizComplete

    var newBadges []string

    // Bonus XP perfect score
    if score == 100 {
        xpEarned += XPPerfectScore
        if err := s.repo.AwardBadge(userID, "perfect_score"); err == nil {
            newBadges = append(newBadges, "perfect_score")
        }
    }

    // Bonus XP first quiz
    if isFirstAttempt {
        xpEarned += XPFirstQuiz
        if err := s.repo.AwardBadge(userID, "first_quiz"); err == nil {
            newBadges = append(newBadges, "first_quiz")
        }
    }

    // Tambah XP ke Redis leaderboard
    if err := s.repo.AddXP(userID, xpEarned); err != nil {
        return nil, errors.New("failed to add XP")
    }

    // Update XP di PostgreSQL juga
    s.repo.UpdateUserXP(userID, xpEarned)

    totalXP, _ := s.repo.GetUserXP(userID)
    rank, _ := s.repo.GetUserRank(userID)

    // Cek badge top 10
    if rank <= 10 && rank > 0 {
        if err := s.repo.AwardBadge(userID, "top_10"); err == nil {
            newBadges = append(newBadges, "top_10")
        }
    }

    return &AwardXPResult{
        XPEarned:  xpEarned,
        TotalXP:   totalXP,
        Rank:      rank,
        NewBadges: newBadges,
    }, nil
}

func (s *service) AwardModuleXP(userID uuid.UUID) (*AwardXPResult, error) {
    xpEarned := XPModuleComplete
    var newBadges []string

    if err := s.repo.AddXP(userID, xpEarned); err != nil {
        return nil, errors.New("failed to add XP")
    }

    s.repo.UpdateUserXP(userID, xpEarned)

    // Badge module complete (hanya sekali)
    if !s.repo.HasBadge(userID, "module_complete") {
        if err := s.repo.AwardBadge(userID, "module_complete"); err == nil {
            newBadges = append(newBadges, "module_complete")
        }
    }

    totalXP, _ := s.repo.GetUserXP(userID)
    rank, _ := s.repo.GetUserRank(userID)

    return &AwardXPResult{
        XPEarned:  xpEarned,
        TotalXP:   totalXP,
        Rank:      rank,
        NewBadges: newBadges,
    }, nil
}

func (s *service) GetLeaderboard(limit int) ([]LeaderboardEntry, error) {
    if limit <= 0 || limit > 100 {
        limit = 10
    }
    return s.repo.GetLeaderboard(limit)
}

func (s *service) GetMyRank(userID uuid.UUID) (int64, int, error) {
    rank, err := s.repo.GetUserRank(userID)
    if err != nil {
        return -1, 0, err
    }
    xp, err := s.repo.GetUserXP(userID)
    if err != nil {
        return -1, 0, err
    }
    return rank, xp, nil
}

func (s *service) GetMyBadges(userID uuid.UUID) ([]models.UserBadge, error) {
    return s.repo.FindUserBadges(userID)
}