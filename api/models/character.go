package models

// Character represents the information we have about a character
type Character struct {
	ID     uint   `json:"id"  gorm:"primary_key"`
	UserID uint   `json:"user_id"`
	Name   string `json:"name"`
}
