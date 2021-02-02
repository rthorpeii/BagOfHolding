package oauth

import (
	"BagOfHolding/users"
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/compute/v1"
	"google.golang.org/api/idtoken"
)

// AuthorizeUser middleware for confirming that the bearer token sent is for
// an authenticated user. Then sets the user_id in the gin context
func AuthorizeUser(c *gin.Context) {
	// Get and validate the Authorization header
	authHeader := c.GetHeader("authorization")
	if authHeader == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "No Auth header"})
		return
	}
	authParts := strings.Split(authHeader, " ")
	if len(authParts) != 2 || strings.ToLower(authParts[0]) != "bearer" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid AuthHeader"})
		return
	}
	// Validate the token that's in the auth header
	ctx := context.Background()
	creds, err := google.FindDefaultCredentials(ctx, compute.ComputeScope)
	payload, err := idtoken.Validate(ctx, authParts[1], creds.ProjectID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": fmt.Errorf("Invalid Bearer Token: %v", err).Error()})
		return
	}
	email := fmt.Sprintf("%v", payload.Claims["email"])
	if email == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "No email found in claims"})
		return
	}

	// Set the user id for use later
	user := users.FindOrCreateUser(email)
	c.Set("user_id", user.ID)
}
