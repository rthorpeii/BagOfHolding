package main

import (
	"BagOfHolding/controllers"
	"BagOfHolding/models"
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("Starting")
	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}

	r.Use(cors.New(config))

	models.ConnectDataBase()

	// /item endpoints
	r.GET("/items", controllers.GetItems)
	r.GET("/items/:id", controllers.GetItem)
	r.GET("/names/", controllers.GetItemNames)
	r.POST("/items", controllers.CreateItem)
	r.PATCH("/items/:id", controllers.UpdateItem)
	r.DELETE("/items/:id", controllers.DeleteItem)

	// inventory update endpoints
	r.GET("/inventory/:user_id", controllers.GetInventory)
	r.POST("/buy/:item_id", controllers.BuyItem)
	r.POST("/sell/:item_id", controllers.SellItem)

	r.Run()
}
