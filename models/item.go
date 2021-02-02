package models

// Item represents a magic item
type Item struct {
	ID         uint    `json:"id" gorm:"primary_key"`
	Name       string  `json:"name"`
	Type       string  `json:"type"`
	Rarity     string  `json:"rarity"`
	Attunement bool    `json:"attunement"`
	Link       string  `json:"link"`
	Charges    int     `json:"charges"`
	Source     string  `json:"source"`
	Cost       float32 `json:"cost"`
}
