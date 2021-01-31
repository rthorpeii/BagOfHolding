package models

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB is our gorm database
var DB *gorm.DB

// ConnectDataBase creates a connection to our database
func ConnectDataBase() {
	database, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		panic("Failed to connect to database!")
	}
	database.AutoMigrate(&Item{})
	database.AutoMigrate(&Inventory{})
	database.Logger.LogMode(logger.Info)
	// database.LogMode(true)

	DB = database
}
