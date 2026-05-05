package profile

import (
	"errors"

	"github.com/google/uuid"
	"github.com/hasanwirayuda/schomora/api/internal/models"
	"golang.org/x/crypto/bcrypt"
)

type UpdateProfileInput struct {
    Name string `json:"name" binding:"required,min=2"`
}

type UpdatePasswordInput struct {
    CurrentPassword string `json:"current_password" binding:"required"`
    NewPassword     string `json:"new_password" binding:"required,min=6"`
    ConfirmPassword string `json:"confirm_password" binding:"required"`
}

type UpdateAvatarInput struct {
    AvatarURL string `json:"avatar_url" binding:"required,url"`
}

type Service interface {
    GetProfile(userID uuid.UUID) (*models.User, error)
    UpdateProfile(userID uuid.UUID, input UpdateProfileInput) (*models.User, error)
    UpdatePassword(userID uuid.UUID, input UpdatePasswordInput) error
    UpdateAvatar(userID uuid.UUID, input UpdateAvatarInput) (*models.User, error)
}

type service struct {
    repo Repository
}

func NewService(repo Repository) Service {
    return &service{repo}
}

func (s *service) GetProfile(userID uuid.UUID) (*models.User, error) {
    user, err := s.repo.FindByID(userID)
    if err != nil {
        return nil, errors.New("user not found")
    }
    return user, nil
}

func (s *service) UpdateProfile(userID uuid.UUID, input UpdateProfileInput) (*models.User, error) {
    if err := s.repo.UpdateProfile(userID, map[string]interface{}{
        "name": input.Name,
    }); err != nil {
        return nil, errors.New("failed to update profile")
    }

    return s.repo.FindByID(userID)
}

func (s *service) UpdatePassword(userID uuid.UUID, input UpdatePasswordInput) error {
    if input.NewPassword != input.ConfirmPassword {
        return errors.New("new password and confirm password do not match")
    }

    user, err := s.repo.FindByID(userID)
    if err != nil {
        return errors.New("user not found")
    }

    // Verify current password
    if err := bcrypt.CompareHashAndPassword(
        []byte(user.PasswordHash),
        []byte(input.CurrentPassword),
    ); err != nil {
        return errors.New("current password is incorrect")
    }

    // Hash new password
    hash, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
    if err != nil {
        return errors.New("failed to hash password")
    }

    return s.repo.UpdateProfile(userID, map[string]interface{}{
        "password_hash": string(hash),
    })
}

func (s *service) UpdateAvatar(userID uuid.UUID, input UpdateAvatarInput) (*models.User, error) {
    if err := s.repo.UpdateProfile(userID, map[string]interface{}{
        "avatar_url": input.AvatarURL,
    }); err != nil {
        return nil, errors.New("failed to update avatar")
    }

    return s.repo.FindByID(userID)
}