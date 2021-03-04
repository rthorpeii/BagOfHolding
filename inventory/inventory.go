package inventory

import (
	"BagOfHolding/models"

	"gorm.io/gorm"
)

// GetEntry looks up an InventoryEntry for the character/item pair passed in.
func GetEntry(characterID, itemID uint, consumed bool) (models.InventoryEntry, error) {
	var entry models.InventoryEntry
	err := models.DB.
		Joins("JOIN items on inventory_entries.item_id = items.id").
		Where("character_id = ? and item_id = ? and consumed = ?", characterID, itemID, consumed).
		Preload("Item").
		First(&entry).Error
	return entry, err
}

// DecrementEntry decrements the count of an InventoryEntry for a character/item pair
func DecrementEntry(characterID, itemID uint, consumed bool) error {
	entry, err := GetEntry(characterID, itemID, consumed)
	if err != nil {
		return err
	}
	// Decrement the count, and delete the entry if the count is 0
	entry.Count--
	if entry.Count == 0 {
		err = models.DB.Delete(&entry).Error
	} else {
		err = models.DB.Model(&entry).Updates(entry).Error
	}
	return err
}

// IncrementEntry increments the count of an InventoryEntry for a character/item pair
func IncrementEntry(characterID, itemID uint, consumed bool) error {
	entry, err := GetEntry(characterID, itemID, consumed)
	if err == gorm.ErrRecordNotFound {
		// Item not in inventory. Create a first entry
		entry = models.InventoryEntry{CharacterID: characterID, ItemID: itemID, Consumed: consumed, Count: 1}
		err = models.DB.Create(&entry).Error
	} else if err == nil {
		// Increase the count of the entry
		entry.Count++
		err = models.DB.Model(&entry).Updates(entry).Error
	}
	return err
}
