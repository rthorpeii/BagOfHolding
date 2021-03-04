package controllers

import (
	"BagOfHolding/inventory"
	"BagOfHolding/users"
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
	c.JSON(http.StatusOK, gin.H{"owned": inventory.Owned, "consumed": inventory.Consumed})
}

// BuyItemInput is the item input
type BuyItemInput struct {
	ItemID      uint `json:"item_id" binding:"required"`
	CharacterID uint `json:"character_id" binding:"required"`
}

// BuyItem purchases one instance of an item for the character
// POST /buy/
func BuyItem(c *gin.Context) {
	// Validate the input from the POST request
	var input BuyItemInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate that the user owns the character
	userID := users.StringToID(c.GetString("user_id"))
	if !users.CharacterExists(userID, input.CharacterID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Invalid Character/User pair"})
		return
	}

	// Update the inventory entry for this item
	err := inventory.IncrementEntry(input.CharacterID, input.ItemID, false)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Could not purchase item. " + err.Error()})
		return
	}

	// Send back the user's inventory
	inventory, err := users.FindInventory(userID, input.CharacterID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"owned": inventory.Owned, "consumed": inventory.Consumed})
}

// SellItemInput is the item input
type SellItemInput struct {
	ItemID      uint `json:"item_id" binding:"required"`
	CharacterID uint `json:"character_id" binding:"required"`
}

// SellItem Sells one instance of an item for a character
// POST /sell/:item_id
func SellItem(c *gin.Context) {
	c.JSON(removeAnItem(c, false))
}

// ConsumeItem consumes one instance of an item for a character
// POST /consume/:item_id
func ConsumeItem(c *gin.Context) {
	c.JSON(removeAnItem(c, true))
}

// If the user owns an instance of the item specified in the request, will decrement the
// count of that item. I consume is true, the user's consumed inventory for that item will
// increase
func removeAnItem(c *gin.Context, consume bool) (int, gin.H) {
	// Validate input
	var input SellItemInput
	if err := c.ShouldBindJSON(&input); err != nil {
		return http.StatusBadRequest, gin.H{"error": err.Error()}
	}

	// Validate that the user owns the character
	userID := users.StringToID(c.GetString("user_id"))
	if !users.CharacterExists(userID, input.CharacterID) {
		return http.StatusForbidden, gin.H{"error": "Invalid Character/User pair"}
	}

	// Look to see if this user has an entry for this item
	err := inventory.DecrementEntry(input.CharacterID, input.ItemID, false)
	if err != nil {
		return http.StatusBadRequest, gin.H{"error": "Can't remove item " + err.Error()}
	}

	// Update the count of the consumed item
	if consume {
		err := inventory.IncrementEntry(input.CharacterID, input.ItemID, true)
		if err != nil {
			return http.StatusUnprocessableEntity, gin.H{"error": "Could not consume item. " + err.Error()}
		}
	}

	// Return the users inventory
	inventory, err := users.FindInventory(userID, input.CharacterID)
	if err != nil {
		return http.StatusBadRequest, gin.H{"error": err.Error()}
	}
	return http.StatusOK, gin.H{"owned": inventory.Owned, "consumed": inventory.Consumed}
}
