package controllers

import (
	"BagOfHolding/models"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func findInventory(userID string) ([]models.Inventory, error) {
	var userInventory []models.Inventory
	if err := models.DB.Joins("JOIN items on inventories.item_id = items.id").
		Where("user_id = ?", userID).Preload("Item").Find(&userInventory).Error; err != nil {
		return userInventory, fmt.Errorf("Inventory not found")
	}
	return userInventory, nil
}

// GetInventory gets a users inventory
// GET /inventory/
func GetInventory(c *gin.Context) {
	userID, _ := c.Get("user_id")
	userInventory, err := findInventory(fmt.Sprintf("%v", userID))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Inventory not found!" + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": userInventory})
}

// BuyItemInput is the item input
type BuyItemInput struct {
	ItemID uint `json:"item_id" binding:"required"`
}

// BuyItem Purchases an item
// POST /buy/:item_id
func BuyItem(c *gin.Context) {
	// Validate input
	var input BuyItemInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rawID, _ := c.Get("user_id")
	userID := fmt.Sprintf("%v", rawID)

	// Look to see if item is already owned by user
	var inventory models.Inventory
	if err := models.DB.Joins("JOIN items on inventories.item_id = items.id").
		Where("user_id = ? and item_id = ?", userID, input.ItemID).Preload("Item").First(&inventory).Error; err != nil {
		// First time buying this item
		// Validate item being purchased
		var item models.Item
		if err := models.DB.Where("id = ?", input.ItemID).First(&item).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Item not found!"})
			return
		}
		intUserID, _ := strconv.ParseUint(userID, 10, 64)
		inventory = models.Inventory{UserID: uint(intUserID), ItemID: item.ID, Item: item, Count: 1}
		models.DB.Create(&inventory)
	} else {
		// Update the count of the item owned
		inventory.Count++
		models.DB.Model(&inventory).Updates(inventory)
	}

	userInventory, err := findInventory(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't find user's inventory"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": userInventory})
	return
}

// SellItemInput is the item input
type SellItemInput struct {
	ItemID uint `json:"item_id" binding:"required"`
}

// SellItem Sells an item
// POST /buy/:item_id
func SellItem(c *gin.Context) {
	// Validate input
	var input SellItemInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rawID, _ := c.Get("user_id")
	userID := fmt.Sprintf("%v", rawID)

	// Look to see if item is owned by the user
	var inventory models.Inventory
	if err := models.DB.Joins("JOIN items on inventories.item_id = items.id").
		Where("user_id = ? and item_id = ?", userID, input.ItemID).Preload("Item").First(&inventory).Error; err != nil {
		// Item not in inventory
		c.JSON(http.StatusBadRequest, gin.H{"error": "You don't own this item"})
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
