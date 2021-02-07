package users

import (
	"BagOfHolding/models"
	"fmt"
)

// CharacterExists checks whether the Character with ID characterID is owned by userID
func CharacterExists(userID, characterID interface{}) bool {
	// Validate that the User is the one with this Character
	if err := models.DB.Where("id = ? AND user_id = ?", characterID, userID).First(&models.Character{}).Error; err != nil {
		return false
	}
	return true
}

// FindInventory returns a slice of Inventory entries for the user/character pair passed in.
func FindInventory(userID, characterID interface{}) ([]models.Inventory, error) {
	if !CharacterExists(userID, characterID) {
		return nil, fmt.Errorf("Invalid Character/User pair")
	}

	var userInventory []models.Inventory
	if err := models.DB.
		Joins("JOIN items on inventories.item_id = items.id").
		Where("character_id = ?", characterID).
		Preload("Item").Find(&userInventory).Error; err != nil {
		return nil, fmt.Errorf("Error finding inventory: %v", err)
	}
	return userInventory, nil
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
