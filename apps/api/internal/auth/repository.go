package auth

import (
	"gorm.io/gorm"
)

type Repository interface {
    CreateUser(user *User) error
    FindByEmail(email string) (*User, error)
    FindByID(id string) (*User, error)
}

type repository struct {
    db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
    return &repository{db}
}

func (r *repository) CreateUser(user *User) error {
    return r.db.Create(user).Error
}

func (r *repository) FindByEmail(email string) (*User, error) {
    var user User
    err := r.db.Where("email = ?", email).First(&user).Error
    if err != nil {
        return nil, err
    }
    return &user, nil
}

func (r *repository) FindByID(id string) (*User, error) {
    var user User
    err := r.db.Where("id = ?", id).First(&user).Error
    if err != nil {
        return nil, err
    }
    return &user, nil
}