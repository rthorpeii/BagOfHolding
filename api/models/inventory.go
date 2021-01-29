package models

// Inventory represents a users inventory
type Inventory struct {
	ID     uint `json:"id"  gorm:"primary_key"`
	UserID uint `json:"user_id"`
	ItemID uint `json:"item_id"`
	Item   Item
	Count  int `json:"count"`
}
