package models

// InventoryEntry represents the common fields shared by owned/consumed entries
type InventoryEntry struct {
	ID          uint `json:"id"  gorm:"primary_key"`
	CharacterID uint `json:"character_id"`
	ItemID      uint `json:"item_id"`
	Item        Item
	Count       int `json:"count"`
}

// Consumed represents the items that the character has consumed
type Consumed struct {
	InventoryEntry
}

func (Consumed) TableName() string {
	return "consumed"
}

// Owned represents the objects owned by a character
type Owned struct {
	InventoryEntry
}

func (Owned) TableName() string {
	return "owned"
}

// Inventory holds a users inventory
type Inventory struct {
	CharacterID uint
	Consumed    []Consumed
	Owned       []Owned
}

// SumCost sums the cost of the owned and consumed items in the user's inventory
func (inventory *Inventory) SumCost() float32 {
	var costTotal float32
	for _, entry := range (*inventory).Owned {
		costTotal += entry.Item.Cost * float32(entry.Count)
	}
	for _, entry := range (*inventory).Consumed {
		costTotal += entry.Item.Cost * float32(entry.Count)
	}
	return costTotal
}
