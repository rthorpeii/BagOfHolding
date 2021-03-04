package users

import (
	"BagOfHolding/models"
	"fmt"
	"strconv"
)

// CharacterExists checks whether the Character with ID characterID is owned by userID
func CharacterExists(userID, characterID interface{}) bool {
	// Validate that the User is the one with this Character
	if err := models.DB.Where("id = ? AND user_id = ?", characterID, userID).First(&models.Character{}).Error; err != nil {
		return false
	}
	return true
}

// ConsumedItems returns a slice of consumed Inventory entries for the character
func consumedItems(characterID interface{}) ([]models.InventoryEntry, error) {
	var consumedItems []models.InventoryEntry
	if err := models.DB.
		Joins("JOIN items on inventory_entries.item_id = items.id").
		Where("character_id = ? AND Consumed = TRUE", characterID).
		Preload("Item").Find(&consumedItems).Error; err != nil {
		return nil, fmt.Errorf("Error finding consumed items: %v", err)
	}
	return consumedItems, nil
}

// ownedItems returns a slice of non-consumed Inventory entries for the character
func ownedItems(characterID interface{}) ([]models.InventoryEntry, error) {
	var ownedItems []models.InventoryEntry
	if err := models.DB.
		Joins("JOIN items on inventory_entries.item_id = items.id").
		Where("character_id = ? AND Consumed = False", characterID).
		Preload("Item").Find(&ownedItems).Error; err != nil {
		return nil, fmt.Errorf("Error finding owned items: %v", err)
	}
	return ownedItems, nil
}

// FindInventory creates an Inventory object for the user/character pair input
func FindInventory(userID uint, characterID uint) (models.Inventory, error) {
	inventory := models.Inventory{CharacterID: characterID}
	if !CharacterExists(userID, characterID) {
		return inventory, fmt.Errorf("Invalid Character/User pair")
	}

	owned, err := ownedItems(characterID)
	if err != nil {
		return inventory, err
	}
	consumed, err := consumedItems(characterID)
	if err != nil {
		return inventory, err
	}
	inventory.Owned = owned
	inventory.Consumed = consumed
	return inventory, nil
}

// FindOrCreateUser returns the user who has the specified email, or creates a new user
// if one isn't found.
func FindOrCreateUser(email string) models.User {
	var user models.User
	if err := models.DB.Where("email = ?", email).First(&user).Error; err != nil {
		// User not found make a new one for them
		user.Email = email
		models.DB.Create(&user)
	}
	return user
}

// StringToID converts a string to a uint for use as an ID
func StringToID(str string) uint {
	uint64Val, _ := strconv.ParseUint(str, 10, 64)
	return uint(uint64Val)
}
