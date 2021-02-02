package models

// Inventory represents a users inventory
type Inventory struct {
	ID          uint `json:"id"  gorm:"primary_key"`
	CharacterID uint `json:"character_id"`
	ItemID      uint `json:"item_id"`
	Item        Item
	Count       int `json:"count"`
}
