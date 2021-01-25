package controllers

import (
	"BagOfHolding/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetItems gets all items
// GET /items
func GetItems(c *gin.Context) {
	var items []models.Item
	models.DB.Find(&items)

	c.JSON(http.StatusOK, gin.H{"data": items})
}

// GetItem gets a single item if it exists
// GET /items/:id
func GetItem(c *gin.Context) {
	var item models.Item

	if err := models.DB.Where("id = ?", c.Param("id")).First(&item).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": item})
}

// CreateItemInput is the item input
type CreateItemInput struct {
	Name       string  `json:"name" binding:"required"`
	Type       string  `json:"type" binding:"required"`
	Rarity     string  `json:"rarity" binding:"required"`
	Attunement bool    `json:"attunement"`
	Link       string  `json:"link" binding:"required"`
	Charges    int     `json:"charges"`
	Source     string  `json:"source" binding:"required"`
	Cost       float32 `json:"cost" binding:"required"`
}

// CreateItem Creates a new item
// POST /items
func CreateItem(c *gin.Context) {
	// Validate input
	var input CreateItemInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create item
	item := models.Item{
		Name:       input.Name,
		Type:       input.Type,
		Rarity:     input.Rarity,
		Attunement: input.Attunement,
		Link:       input.Link,
		Charges:    input.Charges,
		Source:     input.Source,
		Cost:       input.Cost}
	models.DB.Create(&item)

	c.JSON(http.StatusOK, gin.H{"data": item})
}

// UpdateItemInput is the item input
type UpdateItemInput struct {
	Name       string  `json:"name"`
	Type       string  `json:"type"`
	Rarity     string  `json:"rarity"`
	Attunement bool    `json:"attunement"`
	Link       string  `json:"link"`
	Charges    int     `json:"charges"`
	Source     string  `json:"source"`
	Cost       float32 `json:"cost"`
}

// UpdateItem updates an existing item based on its id
// POST /items
func UpdateItem(c *gin.Context) {
	// Get model if exist
	var item models.Item
	if err := models.DB.Where("id = ?", c.Param("id")).First(&item).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	// Validate input
	var input UpdateItemInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Model(&item).Updates(input)

	c.JSON(http.StatusOK, gin.H{"data": item})
}

// DeleteItem deletes an item
// DELETE /items/:id
func DeleteItem(c *gin.Context) {
	// Get model if exist
	var item models.Item
	if err := models.DB.Where("id = ?", c.Param("id")).First(&item).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	models.DB.Delete(&item)

	c.JSON(http.StatusOK, gin.H{"data": true})
}
