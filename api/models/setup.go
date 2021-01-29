package models

import (
	"github.com/jinzhu/gorm"
	// Getting the SQL Driver
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

// DB is our gorm database
var DB *gorm.DB

// ConnectDataBase creates a connection to our database
func ConnectDataBase() {
	database, err := gorm.Open("sqlite3", "test.db")

	if err != nil {
		panic("Failed to connect to database!")
	}
	database.AutoMigrate(&Item{})
	database.AutoMigrate(&Inventory{})
	database.LogMode(true)

	DB = database
}
