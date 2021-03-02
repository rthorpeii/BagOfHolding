package controllers

import (
	"BagOfHolding/models"
	"BagOfHolding/users"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GetInventory gets the inventory entries for a particular character owned by the user
// GET /inventory/:char_id
func GetInventory(c *gin.Context) {
	fmt.Println("USERID: ", c.GetString("user_id"))
	owned, err := users.OwnedItems(c.GetString("user_id"), c.Param("char_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Inventory not found! " + err.Error()})
		return
	}
	consumed, err := users.ConsumedItems(c.GetString("user_id"), c.Param("char_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Consumed items not found! " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"owned": owned, "consumed": consumed})
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

	// Validate that the user has access to the specified character
	if !users.CharacterExists(c.GetString("user_id"), input.CharacterID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Invalid Character/User pair"})
		return
	}

	// Look to see if this user has an inventory entry for this item
	var inventory models.Inventory

	if err := models.DB.
		Joins("JOIN items on inventories.item_id = items.id").
		Where("character_id = ? and item_id = ? and consumed = 0", input.CharacterID, input.ItemID).
		Preload("Item").First(&inventory).Error; err == gorm.ErrRecordNotFound {
		// First time buying this item
		// Validate item being purchased
		var item models.Item
		if err := models.DB.Where("id = ?", input.ItemID).First(&item).Error; err != nil {
			c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Item not found!"})
			return
		}
		inventory = models.Inventory{CharacterID: input.CharacterID, ItemID: item.ID, Item: item, Count: 1}
		models.DB.Create(&inventory)
	} else if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Could not buy item. " + err.Error()})
		return
	} else {
		// Update the count of the item if it's already owned
		inventory.Count++
		models.DB.Model(&inventory).Updates(inventory)
	}

	// Send back the user's inventory
	owned, err := users.OwnedItems(c.GetString("user_id"), input.CharacterID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Inventory not found! " + err.Error()})
		return
	}
	consumed, err := users.ConsumedItems(c.GetString("user_id"), input.CharacterID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Consumed items not found! " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"owned": owned, "consumed": consumed})
}

// SellItemInput is the item input
type SellItemInput struct {
	ItemID      uint `json:"item_id" binding:"required"`
	CharacterID uint `json:"character_id" binding:"required"`
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

	// Validate that the user has access to the specified character
	if !users.CharacterExists(c.GetString("user_id"), input.CharacterID) {
		return http.StatusForbidden, gin.H{"error": "Invalid Character/User pair"}
	}

	// Look to see if this user has an inventory entry for this item
	var inventory models.Inventory
	if err := models.DB.
		Joins("JOIN items on inventories.item_id = items.id").
		Where("character_id = ? and item_id = ? and consumed = 0", input.CharacterID, input.ItemID).
		Preload("Item").First(&inventory).Error; err == gorm.ErrRecordNotFound {
		// Item not in inventory
		return http.StatusBadRequest, gin.H{"error": "Can't sell an item you don't own"}
	} else if err != nil {
		return http.StatusUnprocessableEntity, gin.H{"error": "Could not sell item. " + err.Error()}
	}

	// Update the count of the item owned
	inventory.Count--
	if inventory.Count == 0 {
		if err := models.DB.Delete(&inventory).Error; err != nil {
			return http.StatusBadRequest, gin.H{"error": "Error removing the last instance of an item"}
		}
	}
	models.DB.Model(&inventory).Updates(inventory)

	if consume {
		// See if the user already has consumed items of this type
		var consumedInventory models.Inventory
		if err := models.DB.
			Joins("JOIN items on inventories.item_id = items.id").
			Where("character_id = ? and item_id = ? and consumed = 1", input.CharacterID, input.ItemID).
			Preload("Item").First(&consumedInventory).Error; err == gorm.ErrRecordNotFound {
			// Item not in consumed inventory. Create a first entry
			consumedInventory = models.Inventory{CharacterID: input.CharacterID, ItemID: input.ItemID, Consumed: true, Count: 1}
			models.DB.Create(&consumedInventory)
		} else if err != nil {
			return http.StatusUnprocessableEntity, gin.H{"error": "Could not sell item. " + err.Error()}
		} else {
			// Increase the count of the consumed item
			consumedInventory.Count++
			models.DB.Model(&consumedInventory).Updates(consumedInventory)
		}
	}

	// Send back the user's inventory
	owned, err := users.OwnedItems(c.GetString("user_id"), input.CharacterID)
	if err != nil {
		return http.StatusInternalServerError, gin.H{"error": "Couldn't find user's inventory"}
	}
	consumed, err := users.ConsumedItems(c.GetString("user_id"), input.CharacterID)
	if err != nil {
		return http.StatusInternalServerError, gin.H{"error": "Couldn't find user's consumed items"}
	}
	return http.StatusOK, gin.H{"owned": owned, "consumed": consumed}
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
