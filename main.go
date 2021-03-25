package main

import (
	"BagOfHolding/controllers"
	"BagOfHolding/middleware"
	"BagOfHolding/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	// setup a connection to our database
	models.ConnectDataBase()

	// Initialize and configure our router
	router := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AddAllowHeaders("authorization")
	router.Use(cors.New(config))

	// React files
	router.Use(static.Serve("/", static.LocalFile("./ui/build", true)))

	// Public API endpoints
	public := router.Group("/api")
	public.GET("/items", controllers.GetItems)
	public.GET("/items/:id", controllers.GetItem)
	public.POST("/items", controllers.CreateItem)
	public.PATCH("/items/:id", controllers.UpdateItem)
	public.DELETE("/items/:id", controllers.DeleteItem)
	public.GET("/names/", controllers.GetItemNames)

	// Authorized API endpoints
	// Login and refresh
	authMiddleware := middleware.InitAuthMiddleware
	public.POST("/login", authMiddleware().LoginHandler)
	public.GET("/refresh", authMiddleware().RefreshHandler)
	authorized := router.Group("/api", authMiddleware().MiddlewareFunc())
	// Character endpoints
	authorized.GET("/characters/", controllers.GetCharacters)
	authorized.POST("/characters/", controllers.CreateCharacter)
	authorized.DELETE("/characters/:id", controllers.DeleteCharacters)
	// Inventory management
	authorized.GET("/inventory/:char_id", controllers.GetInventory)
	authorized.POST("/buy/", controllers.BuyItem)
	authorized.POST("/sell/", controllers.SellItem)
	authorized.POST("/consume/", controllers.ConsumeItem)

	router.Run()
}
