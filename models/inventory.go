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
