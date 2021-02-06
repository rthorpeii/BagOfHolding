package main

import (
	"BagOfHolding/controllers"
	"BagOfHolding/models"
	"BagOfHolding/oauth"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AddAllowHeaders("authorization")
	router.Use(cors.New(config))

	models.ConnectDataBase()

	// React files
	router.Use(static.Serve("/", static.LocalFile("./client/build", true)))

	// Public endpoints
	public := router.Group("/api")
	public.GET("/items", controllers.GetItems)
	public.GET("/items/:id", controllers.GetItem)
	public.POST("/items", controllers.CreateItem)
	public.PATCH("/items/:id", controllers.UpdateItem)
	public.DELETE("/items/:id", controllers.DeleteItem)
	public.GET("/names/", controllers.GetItemNames)

	// Authorized endpoints
	authorized := router.Group("/api", oauth.AuthorizeUser)
	// Character endpoints
	authorized.GET("/characters/", controllers.GetCharacters)
	authorized.POST("/characters/", controllers.CreateCharacter)
	authorized.DELETE("/characters/:id", controllers.DeleteCharacters)
	// Inventory management
	authorized.GET("/inventory/:char_id", controllers.GetInventory)
	authorized.POST("/buy/", controllers.BuyItem)
	authorized.POST("/sell/", controllers.SellItem)

	router.Run()
}
