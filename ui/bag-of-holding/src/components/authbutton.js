import React, { useContext, useEffect } from 'react';
import AuthContext from './authcontext.js'
import { GoogleLogin, GoogleLogout } from 'react-google-login';

var jwt = require('jsonwebtoken');

function AuthButton() {
    const {loggedIn, setLoggedIn} = useContext(AuthContext)

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token === null) {
            setLoggedIn(false)
            return
        }
        var decodedToken = jwt.decode(token, { complete: true })
        var dateNow = new Date();

        if (decodedToken.exp < dateNow.getTime()) {
            setLoggedIn(true)
        }
    }, [])

    const refreshTokenSetup = (res) => {
        // Timing to renew access token
        let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

        const refreshToken = async () => {
            const newAuthRes = await res.reloadAuthResponse();
            refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
            console.log('newAuthRes:', newAuthRes);
            // saveUserToken(newAuthRes.access_token);  <-- save new token
            localStorage.setItem('authToken', newAuthRes.id_token);

            // Setup the other timer after the first one
            setTimeout(refreshToken, refreshTiming);
        };

        // Setup first refresh timer
        setTimeout(refreshToken, refreshTiming);
    };

    const responseGoogle = (response) => {
        console.log(response);
    }

    const onLoginSuccess = (response) => {
        // console.log("Success: " + JSON.stringify(response))
        window.localStorage.setItem('authToken', response.tokenObj.id_token);
        refreshTokenSetup(response);
        setLoggedIn(true)
    }

    const onLogoutSuccess = (response) => {
        window.localStorage.removeItem('authToken')
        setLoggedIn(false)
    }
    return (
        <AuthContext.Consumer>
            {({ loggedIn, setLoggedIn }) => (
                <div>
                    { loggedIn ?
                        <GoogleLogout
                            clientId="1090301103642-op1uhu99i3naegpk86siaqqf4nddn0c1.apps.googleusercontent.com"
                            buttonText='Logout'
                            onLogoutSuccess={onLogoutSuccess}
                            onFailure={responseGoogle}
                        />
                        : <GoogleLogin
                            clientId="1090301103642-op1uhu99i3naegpk86siaqqf4nddn0c1.apps.googleusercontent.com"
                            buttonText="Login"
                            onSuccess={onLoginSuccess}
                            onFailure={responseGoogle}
                            cookiePolicy={'single_host_origin'}
                            isSignedIn={true}
                        />
                    }
                </div>
            )}
        </AuthContext.Consumer>
    )



}

export default AuthButton;