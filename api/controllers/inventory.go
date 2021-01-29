package controllers

import (
	"BagOfHolding/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetInventory gets a users inventory
// GET /items/:user_id
func GetInventory(c *gin.Context) {
	var userInventory []models.Inventory

	if err := models.DB.Joins("JOIN items on inventories.item_id = items.id").
		Where("user_id = ?", c.Param("user_id")).Preload("Item").Find(&userInventory).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Inventory not found!" + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": userInventory})
}

// BuyItemInput is the item input
type BuyItemInput struct {
	UserID uint `json:"user_id" binding:"required"`
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

	// Validate item being purchased
	var item models.Item
	if err := models.DB.Where("id = ?", c.Param("item_id")).First(&item).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Item not found!"})
		return
	}

	// Look to see if item is already owned by user
	var inventory models.Inventory
	if err := models.DB.Joins("JOIN items on inventories.item_id = items.id").
		Where("user_id = ? and item_id = ?", input.UserID, item.ID).Preload("Item").First(&inventory).Error; err != nil {
		// First time buying this item
		inventory = models.Inventory{UserID: input.UserID, ItemID: item.ID, Item: item, Count: 1}
		models.DB.Create(&inventory)
		c.JSON(http.StatusOK, gin.H{"data": inventory})
		return
	}

	// Update the count of the item owned
	inventory.Count++
	models.DB.Model(&inventory).Updates(inventory)
	c.JSON(http.StatusOK, gin.H{"data": inventory})
}
