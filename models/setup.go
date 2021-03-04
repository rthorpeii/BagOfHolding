package models

import (
	"os"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB is our gorm database
var DB *gorm.DB

// ConnectDataBase creates a connection to our database
func ConnectDataBase() {
	audience := os.Getenv("GORM_LOGGING")
	var logLevel logger.LogLevel
	switch audience {
	case "error":
		logLevel = logger.Error
	case "warn":
		logLevel = logger.Warn
	case "silent":
		logLevel = logger.Silent
	default:
		logLevel = logger.Info
	}

	database, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logLevel),
	})

	if err != nil {
		panic("Failed to connect to database!")
	}
	database.AutoMigrate(&Item{})
	database.AutoMigrate(&InventoryEntry{})
	database.AutoMigrate(&User{})
	database.AutoMigrate(&Character{})
	database.Logger.LogMode(logger.Info)
	// database.LogMode(true)

	DB = database
}
