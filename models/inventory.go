package models

// InventoryEntry represents an entry in a users inventory
type InventoryEntry struct {
	ID          uint `json:"id"  gorm:"primary_key"`
	CharacterID uint `json:"character_id"`
	ItemID      uint `json:"item_id"`
	Item        Item
	Consumed    bool `json:"consumed"`
	Count       int  `json:"count"`
}

// Inventory holds a users inventory
type Inventory struct {
	CharacterID uint
	Consumed    []InventoryEntry
	Owned       []InventoryEntry
}
