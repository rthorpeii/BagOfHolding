package middleware

import (
	"BagOfHolding/models"
	"BagOfHolding/users"
	"context"
	"fmt"
	"log"
	"os"
	"time"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/idtoken"
)

var identityKey = "id"

type login struct {
	Token string `json:"token"`
}

// InitAuthMiddleware initializes the authentication middleware
func InitAuthMiddleware() *jwt.GinJWTMiddleware {
	authMiddleware, err := jwt.New(&jwt.GinJWTMiddleware{
		Realm:       "handy-haversack.herokuapp.com",
		Key:         []byte(os.Getenv("JWT_KEY")),
		Timeout:     time.Hour,
		MaxRefresh:  time.Hour,
		IdentityKey: identityKey,
		PayloadFunc: func(data interface{}) jwt.MapClaims {
			if user, ok := data.(models.User); ok {
				return jwt.MapClaims{
					identityKey: user.ID,
				}
			}
			return jwt.MapClaims{}
		},
		IdentityHandler: func(c *gin.Context) interface{} {
			claims := jwt.ExtractClaims(c)
			id := claims[identityKey].(float64)
			c.Set("user_id", fmt.Sprint(id))
			return &models.User{
				ID: uint(id),
			}
		},
		Authenticator: func(c *gin.Context) (interface{}, error) {
			var loginVals login
			if err := c.ShouldBind(&loginVals); err != nil {
				return "", jwt.ErrMissingLoginValues
			}

			// Validate the token that's in the auth header
			ctx := context.Background()
			audience := os.Getenv("GOOGLE_PROJECT_ID")
			payload, err := idtoken.Validate(ctx, loginVals.Token, audience)
			if err != nil {
				return nil, jwt.ErrFailedAuthentication
			}
			email := fmt.Sprintf("%v", payload.Claims["email"])
			if email == "" {
				return nil, jwt.ErrFailedAuthentication
			}
			user := users.FindOrCreateUser(email)
			return user, nil
		},
		Unauthorized: func(c *gin.Context, code int, message string) {
			c.JSON(code, gin.H{
				"code":    code,
				"message": message,
			})
		},
		// TokenLookup is a string in the form of "<source>:<name>" that is used
		// to extract token from the request.
		// Optional. Default value "header:Authorization".
		// Possible values:
		// - "header:<name>"
		// - "query:<name>"
		// - "cookie:<name>"
		// - "param:<name>"
		// TokenLookup: "header: Authorization, query: token, cookie: jwt",
		// TokenLookup: "query:token",
		// TokenLookup: "cookie:token",

		// TokenHeadName is a string in the header. Default value is "Bearer"
		TokenHeadName: "Bearer",

		// TimeFunc provides the current time. You can override it to use another time value. This is useful for testing or if your server uses a different time zone than your tokens.
		TimeFunc: time.Now,
	})

	if err != nil {
		log.Fatal("JWT Error:" + err.Error())
	}

	return authMiddleware
}
