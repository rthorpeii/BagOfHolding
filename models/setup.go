package models

import (
	"database/sql"
	"fmt"
	"os"

	// Importing the postgres sql driver
	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
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
	gormConfig := gorm.Config{
		Logger: logger.Default.LogMode(logLevel),
	}

	var database *gorm.DB

	uri := os.Getenv("DATABASE_URL")
	if uri == "" {
		host := os.Getenv("POSTGRES_HOST")
		user := os.Getenv("POSTGRES_USER")
		password := os.Getenv("POSTGRES_PASS")
		dbname := os.Getenv("POSTGRES_DB")
		port := os.Getenv("POSTGRES_PORT")
		dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s", host, user, password, dbname, port)
		db, err := gorm.Open(postgres.Open(dsn), &gormConfig)
		if err != nil {
			panic("Failed to connect to database!" + err.Error())
		}
		database = db
	} else {
		sqlDB, err := sql.Open("postgres", uri)
		if err != nil {
			panic("Failed to open database!" + err.Error())
		}
		db, err := gorm.Open(postgres.New(postgres.Config{
			Conn: sqlDB,
		}), &gormConfig)
		if err != nil {
			panic("Failed to connect to database!" + err.Error())
		}
		database = db
	}

	database.AutoMigrate(&Item{})
	database.AutoMigrate(&InventoryEntry{})
	database.AutoMigrate(&User{})
	database.AutoMigrate(&Character{})

	DB = database
}
