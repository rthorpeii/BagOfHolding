package controllers

import (
	"BagOfHolding/models"
	"BagOfHolding/users"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// CreateCharacterInput is the input for creating characters
type CreateCharacterInput struct {
	Name string `json:"name" binding:"required"`
}

// CreateCharacter defines a character
// POST /character/
func CreateCharacter(c *gin.Context) {
	// Validate input
	var input CreateCharacterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	userID, _ := strconv.ParseUint(c.GetString("user_id"), 10, 64)

	character := models.Character{
		UserID: uint(userID),
		Name:   input.Name,
	}
	models.DB.Create(&character)
	c.JSON(http.StatusOK, gin.H{"data": character})
}

// GetCharacters gets the characters of the authenticated user
// GET /characters/
func GetCharacters(c *gin.Context) {
	var characters []models.Character
	userID, _ := c.Get("user_id")

	// We don't mind returning an empty list
	models.DB.Where("user_id = ?", userID).Find(&characters)
	c.JSON(http.StatusOK, gin.H{"data": characters})
}

// DeleteCharacters deletes the character matching the id
// but only if the authenticated user owns that character
// DELETE /characters/:id
func DeleteCharacters(c *gin.Context) {
	var character models.Character
	userID, _ := c.Get("user_id")

	// Look for a character owned by the user with the correct ID
	if !users.CharacterExists(userID, c.Param("id")) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Character not found!"})
		return
	}
	models.DB.Delete(character)
	c.JSON(http.StatusOK, gin.H{"data": true})
}
