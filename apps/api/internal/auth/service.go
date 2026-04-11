package auth

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type RegisterInput struct {
    Name     string `json:"name" binding:"required,min=2"`
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=6"`
}

type LoginInput struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
    Token string `json:"token"`
    User  User   `json:"user"`
}

type Service interface {
    Register(input RegisterInput) (*AuthResponse, error)
    Login(input LoginInput) (*AuthResponse, error)
}

type service struct {
    repo Repository
}

func NewService(repo Repository) Service {
    return &service{repo}
}

func (s *service) Register(input RegisterInput) (*AuthResponse, error) {
    // Cek email sudah dipakai
    existing, _ := s.repo.FindByEmail(input.Email)
    if existing != nil {
        return nil, errors.New("email already registered")
    }

    // Hash password
    hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
    if err != nil {
        return nil, errors.New("failed to hash password")
    }

    user := &User{
        Name:         input.Name,
        Email:        input.Email,
        PasswordHash: string(hash),
        Role:         RoleStudent,
    }

    if err := s.repo.CreateUser(user); err != nil {
        return nil, errors.New("failed to create user")
    }

    token, err := generateToken(user)
    if err != nil {
        return nil, err
    }

    return &AuthResponse{Token: token, User: *user}, nil
}

func (s *service) Login(input LoginInput) (*AuthResponse, error) {
    user, err := s.repo.FindByEmail(input.Email)
    if err != nil {
        return nil, errors.New("invalid email or password")
    }

    if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
        return nil, errors.New("invalid email or password")
    }

    token, err := generateToken(user)
    if err != nil {
        return nil, err
    }

    return &AuthResponse{Token: token, User: *user}, nil
}

func generateToken(user *User) (string, error) {
    claims := jwt.MapClaims{
        "user_id": user.ID.String(),
        "email":   user.Email,
        "role":    user.Role,
        "exp":     time.Now().Add(7 * 24 * time.Hour).Unix(),
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}