package users

import "BagOfHolding/models"

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
