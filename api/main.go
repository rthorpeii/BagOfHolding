package main

import (
	"BagOfHolding/controllers"
	"BagOfHolding/models"
	"BagOfHolding/oauth"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

const testToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjAzYjJkMjJjMmZlY2Y4NzNlZDE5ZTViOGNmNzA0YWZiN2UyZWQ0YmUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTA5MDMwMTEwMzY0Mi1vcDF1aHU5OWkzbmFlZ3BrODZzaWFxcWY0bmRkbjBjMS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjEwOTAzMDExMDM2NDItb3AxdWh1OTlpM25hZWdwazg2c2lhcXFmNG5kZG4wYzEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTgwMDk1MDMzODIwMTEyNDY0MjAiLCJlbWFpbCI6InJvYmVydHRob3JwZWlpQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiNXh0eHFkdU14S0RoOVhwZDlHNUVpUSIsIm5hbWUiOiJSb2JlcnQgVGhvcnBlIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdnc1FKY3NCVjVDOVp5aEJCcGpWQzNGMTFsTjhKVzdQRXJiZGlvYz1zOTYtYyIsImdpdmVuX25hbWUiOiJSb2JlcnQiLCJmYW1pbHlfbmFtZSI6IlRob3JwZSIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjEyMTMxODY4LCJleHAiOjE2MTIxMzU0NjgsImp0aSI6IjgyNzhkOWZhODRmYzM0NDg5MGFlZjFiMDE5ZjhkOWI5MzQzZjY1NjkifQ.fhvjd242XGhmogUiUser9KAM007oKLkMbFoO1CHwjeVtSppEKi2hLxFoJaRreo0DQ-_qvr2MLO8kluEznMhD6C3k1x63HLxudQbPhypQL60CjH6z9QhkawzEbOUtgBupVRvNbB_8z8sN_lATckILiJZBI63sg7T10C9-RZkV3VhVfq4Od7dib6M6hJJOFbpqQs5JgcDvcawiyH75ydQ5xpav-1mdcl3SUsG_hwv4Qpobm006Q9xe0xW933tkVemWnS63ebbHF5YFEWjJG5VRk-Uo4T0Lisr_XikIYb1ICUC_GF8WGPdaGDLmjopsjclEYmS9tejEELAqc4FOrHPRuQ"

func main() {
	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AddAllowHeaders("authorization")
	router.Use(cors.New(config))

	models.ConnectDataBase()

	// React files
	router.Use(static.Serve("/", static.LocalFile("./client/build", true)))

	// public endpoints
	public := router.Group("/api")
	public.GET("/items/:id", controllers.GetItem)
	public.GET("/names/", controllers.GetItemNames)
	public.POST("/items", controllers.CreateItem)
	public.PATCH("/items/:id", controllers.UpdateItem)
	public.DELETE("/items/:id", controllers.DeleteItem)

	// Authorized endpoints
	authorized := router.Group("/api", oauth.AuthorizeUser)
	// inventory update endpoints
	authorized.GET("/items", controllers.GetItems)
	// Character endpoints
	authorized.GET("/characters/", controllers.GetCharacters)
	authorized.POST("/characters/", controllers.CreateCharacter)
	// Inventory management
	authorized.GET("/inventory/:char_id", controllers.GetInventory)
	authorized.POST("/buy/", controllers.BuyItem)
	authorized.POST("/sell/", controllers.SellItem)

	router.Run()
}
