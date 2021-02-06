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
	userInventory, err := users.FindInventory(c.GetString("user_id"), c.Param("char_id"), false)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Inventory not found! " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": userInventory})
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
		Where("character_id = ? and item_id = ?", input.CharacterID, input.ItemID).
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
	userInventory, err := users.FindInventory(c.GetString("user_id"), input.CharacterID, false)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't find user's inventory"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": userInventory})
	return
}

// SellItemInput is the item input
type SellItemInput struct {
	ItemID      uint `json:"item_id" binding:"required"`
	CharacterID uint `json:"character_id" binding:"required"`
}

// SellItem Sells one instance of an item for a character
// POST /sell/:item_id
func SellItem(c *gin.Context) {
	// Validate input
	var input SellItemInput
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
		Where("character_id = ? and item_id = ?", input.CharacterID, input.ItemID).
		Preload("Item").First(&inventory).Error; err == gorm.ErrRecordNotFound {
		// Item not in inventory
		c.JSON(http.StatusBadRequest, gin.H{"error": "Can't sell an item you don't own"})
		return
	} else if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Could not sell item. " + err.Error()})
		return
	}

	// Update the count of the item owned
	inventory.Count--
	if inventory.Count == 0 {
		if err := models.DB.Delete(&inventory).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Error removing the last instance of an item"})
		} else {
			c.JSON(http.StatusOK, gin.H{"data": "1"})
		}
		return
	}
	models.DB.Model(&inventory).Updates(inventory)
	c.JSON(http.StatusOK, gin.H{"data": inventory})
}
