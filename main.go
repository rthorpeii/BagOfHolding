package main

import (
	"BagOfHolding/controllers"
	"BagOfHolding/models"
	"fmt"

	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("Starting")
	r := gin.Default()

	models.ConnectDataBase()

	r.GET("/items", controllers.GetItems)
	r.GET("/items/:id", controllers.GetItem)
	r.POST("/items", controllers.CreateItem)
	r.PATCH("/items/:id", controllers.UpdateItem)
	r.DELETE("/items/:id", controllers.DeleteItem)

	r.Run()
}
