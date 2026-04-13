package gamification

import (
	"context"
	"strconv"

	"github.com/google/uuid"
	"github.com/hasanwirayuda/schomora/api/internal/models"
	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

const leaderboardKey = "schomora:leaderboard"

type Repository interface {
    // XP
    AddXP(userID uuid.UUID, xp int) error
    GetUserXP(userID uuid.UUID) (int, error)

    // Leaderboard
    GetLeaderboard(limit int) ([]LeaderboardEntry, error)
    GetUserRank(userID uuid.UUID) (int64, error)

    // Badge
    SeedBadges(badges []models.Badge) error
    FindUserBadges(userID uuid.UUID) ([]models.UserBadge, error)
    HasBadge(userID uuid.UUID, code string) bool
    AwardBadge(userID uuid.UUID, code string) error
    FindUserByID(userID uuid.UUID) (*models.User, error)
    UpdateUserXP(userID uuid.UUID, xp int) error
}

type LeaderboardEntry struct {
    Rank   int    `json:"rank"`
    UserID string `json:"user_id"`
    Name   string `json:"name"`
    XP     int    `json:"xp"`
}

type repository struct {
    db    *gorm.DB
    redis *redis.Client
}

func NewRepository(db *gorm.DB, redis *redis.Client) Repository {
    return &repository{db, redis}
}

func (r *repository) AddXP(userID uuid.UUID, xp int) error {
    ctx := context.Background()
    return r.redis.ZIncrBy(ctx, leaderboardKey, float64(xp), userID.String()).Err()
}

func (r *repository) GetUserXP(userID uuid.UUID) (int, error) {
    ctx := context.Background()
    score, err := r.redis.ZScore(ctx, leaderboardKey, userID.String()).Result()
    if err == redis.Nil {
        return 0, nil
    }
    if err != nil {
        return 0, err
    }
    return int(score), nil
}

func (r *repository) GetLeaderboard(limit int) ([]LeaderboardEntry, error) {
    ctx := context.Background()

    // ZRevRangeWithScores = urutkan dari XP tertinggi
    results, err := r.redis.ZRevRangeWithScores(ctx, leaderboardKey, 0, int64(limit-1)).Result()
    if err != nil {
        return nil, err
    }

    var entries []LeaderboardEntry
    for i, z := range results {
        userID := z.Member.(string)

        // Ambil nama user dari database
        var user models.User
        r.db.Where("id = ?", userID).First(&user)

        entries = append(entries, LeaderboardEntry{
            Rank:   i + 1,
            UserID: userID,
            Name:   user.Name,
            XP:     int(z.Score),
        })
    }

    return entries, nil
}

func (r *repository) GetUserRank(userID uuid.UUID) (int64, error) {
    ctx := context.Background()
    rank, err := r.redis.ZRevRank(ctx, leaderboardKey, userID.String()).Result()
    if err == redis.Nil {
        return -1, nil
    }
    if err != nil {
        return -1, err
    }
    return rank + 1, nil // +1 karena zero-based
}

func (r *repository) SeedBadges(badges []models.Badge) error {
    for _, badge := range badges {
        var existing models.Badge
        err := r.db.Where("code = ?", badge.Code).First(&existing).Error
        if err != nil {
            // Belum ada, insert
            r.db.Create(&badge)
        }
    }
    return nil
}

func (r *repository) FindUserBadges(userID uuid.UUID) ([]models.UserBadge, error) {
    var badges []models.UserBadge
    err := r.db.Preload("Badge").
        Where("user_id = ?", userID).
        Find(&badges).Error
    return badges, err
}

func (r *repository) HasBadge(userID uuid.UUID, code string) bool {
    var count int64
    r.db.Model(&models.UserBadge{}).
        Where("user_id = ? AND badge_code = ?", userID, code).
        Count(&count)
    return count > 0
}

func (r *repository) AwardBadge(userID uuid.UUID, code string) error {
    if r.HasBadge(userID, code) {
        return nil
    }
    badge := &models.UserBadge{
        UserID:    userID,
        BadgeCode: code,
    }
    return r.db.Create(badge).Error
}

func (r *repository) FindUserByID(userID uuid.UUID) (*models.User, error) {
    var user models.User
    err := r.db.Where("id = ?", userID).First(&user).Error
    if err != nil {
        return nil, err
    }
    return &user, nil
}

func (r *repository) UpdateUserXP(userID uuid.UUID, xp int) error {
    return r.db.Model(&models.User{}).
        Where("id = ?", userID).
        Update("xp_total", gorm.Expr("xp_total + ?", strconv.Itoa(xp))).Error
}