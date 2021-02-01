package models

// User represents the information we have about the user
type User struct {
	ID    uint   `json:"id"  gorm:"primary_key"`
	Email string `json:"email"`
}
