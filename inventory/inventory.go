package inventory

import (
	"BagOfHolding/models"

	"gorm.io/gorm"
)

// GetConsumed looks up a Consumed for the character/item pair passed in.
func GetConsumed(characterID, itemID uint) (models.Consumed, error) {
	var entry models.Consumed
	err := models.DB.
		Joins("JOIN items on consumed.item_id = items.id").
		Where("character_id = ? and item_id = ?", characterID, itemID).
		Preload("Item").
		First(&entry).Error
	return entry, err
}

// GetOwned looks up an Owned entry for the character/item pair passed in.
func GetOwned(characterID, itemID uint) (models.Owned, error) {
	var entry models.Owned
	err := models.DB.
		Joins("JOIN items on owned.item_id = items.id").
		Where("character_id = ? and item_id = ?", characterID, itemID).
		Preload("Item").
		First(&entry).Error
	return entry, err
}

// DecrementEntry decrements the count of an InventoryEntry for a character/item pair
func DecrementEntry(characterID, itemID uint, consumed bool) error {
	if consumed {
		entry, err := GetConsumed(characterID, itemID)
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
	} else {
		entry, err := GetOwned(characterID, itemID)
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
}

// IncrementEntry increments the count of an InventoryEntry for a character/item pair
func IncrementEntry(characterID, itemID uint, consumed bool) error {
	if consumed {
		entry, err := GetConsumed(characterID, itemID)
		if err == gorm.ErrRecordNotFound {
			// Item not in inventory. Create a first entry
			invEntry := models.InventoryEntry{CharacterID: characterID, ItemID: itemID, Count: 1}
			entry = models.Consumed{invEntry}
			err = models.DB.Create(&entry).Error
		} else if err == nil {
			// Increase the count of the entry
			entry.Count++
			err = models.DB.Model(&entry).Updates(entry).Error
		}
		return err
	}
	entry, err := GetOwned(characterID, itemID)
	if err == gorm.ErrRecordNotFound {
		// Item not in inventory. Create a first entry
		invEntry := models.InventoryEntry{CharacterID: characterID, ItemID: itemID, Count: 1}
		entry = models.Owned{invEntry}
		err = models.DB.Create(&entry).Error
	} else if err == nil {
		// Increase the count of the entry
		entry.Count++
		err = models.DB.Model(&entry).Updates(entry).Error
	}
	return err

}
