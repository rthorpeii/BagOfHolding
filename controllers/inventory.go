package controllers

import (
	"BagOfHolding/inventory"
	"BagOfHolding/users"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetInventory gets the inventory entries for a particular character owned by the user
// GET /inventory/:char_id
func GetInventory(c *gin.Context) {
	userID := users.StringToID(c.GetString("user_id"))
	characterID := users.StringToID(c.Param("char_id"))
	inventory, err := users.FindInventory(userID, characterID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK,
		gin.H{
			"owned":    inventory.Owned,
			"consumed": inventory.Consumed,
			"cost":     inventory.SumCost(),
		})
}

// ModifyInventoryInput is the item input for buying/selling/consuming items
type ModifyInventoryInput struct {
	UserID      uint
	ItemID      uint `json:"item_id" binding:"required"`
	CharacterID uint `json:"character_id" binding:"required"`
}

// BuyItem purchases one instance of an item for the character
// POST /buy/
func BuyItem(c *gin.Context) {
	err, input := validateInput(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update the inventory entry for this item
	err = inventory.IncrementEntry(input.CharacterID, input.ItemID, false)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Could not purchase item. " + err.Error()})
		return
	}

	// Send back the user's inventory
	inventory, err := users.FindInventory(input.UserID, input.CharacterID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK,
		gin.H{
			"owned":    inventory.Owned,
			"consumed": inventory.Consumed,
			"cost":     inventory.SumCost(),
		})
}

// SellItem Sells one instance of an item for a character
// POST /sell/
func SellItem(c *gin.Context) {
	c.JSON(removeAnItem(c, false))
}

// ConsumeItem consumes one instance of an item for a character
// POST /consume/
func ConsumeItem(c *gin.Context) {
	c.JSON(removeAnItem(c, true))
}

// Decrement the count of an owned item. Optionally, increment the consumed count for that item
func removeAnItem(c *gin.Context, consume bool) (int, gin.H) {
	err, input := validateInput(c)
	if err != nil {
		return http.StatusBadRequest, gin.H{"error": err.Error()}
	}

	// Update the counts of the item
	if err := inventory.DecrementEntry(input.CharacterID, input.ItemID, false); err != nil {
		return http.StatusBadRequest, gin.H{"error": "Can't remove item " + err.Error()}
	}
	if consume {
		if err := inventory.IncrementEntry(input.CharacterID, input.ItemID, true); err != nil {
			return http.StatusUnprocessableEntity, gin.H{"error": "Could not consume item. " + err.Error()}
		}
	}

	// Return the users inventory
	inventory, err := users.FindInventory(input.UserID, input.CharacterID)
	if err != nil {
		return http.StatusBadRequest, gin.H{"error": err.Error()}
	}
	return http.StatusOK,
		gin.H{
			"owned":    inventory.Owned,
			"consumed": inventory.Consumed,
			"cost":     inventory.SumCost(),
		}
}

// UnconsumeItem restores a consumed item to the inventory
// POST /unconsume/
func UnconsumeItem(c *gin.Context) {
	err, input := validateInput(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update the counts of the item
	if err := inventory.DecrementEntry(input.CharacterID, input.ItemID, true); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Can't remove item " + err.Error()})
		return
	}
	if err := inventory.IncrementEntry(input.CharacterID, input.ItemID, false); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Could not consume item. " + err.Error()})
		return
	}

	// Return the users inventory
	inventory, err := users.FindInventory(input.UserID, input.CharacterID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK,
		gin.H{
			"owned":    inventory.Owned,
			"consumed": inventory.Consumed,
			"cost":     inventory.SumCost(),
		})
}

// Validate that the input has a proper user/character pair
func validateInput(c *gin.Context) (error, ModifyInventoryInput) {
	var input ModifyInventoryInput
	if err := c.ShouldBindJSON(&input); err != nil {
		return err, input
	}
	userID := users.StringToID(c.GetString("user_id"))
	if !users.CharacterExists(userID, input.CharacterID) {
		return fmt.Errorf("Invalid Character/User pair"), input
	}
	input.UserID = userID
	return nil, input
}
