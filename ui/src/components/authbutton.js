import { useContext, useEffect } from 'react';
import AuthContext from './authcontext.js'
import { GoogleLogin, GoogleLogout } from 'react-google-login';

import ApiClient from './api-client'

var jwt = require('jsonwebtoken');

function AuthButton() {

    const { setLoggedIn } = useContext(AuthContext)
    useEffect(() => {
        let mounted = true;
        const token = localStorage.getItem('authToken');
        if (token === null) {
            if (mounted) {
                setLoggedIn(false)
            }
            return () => mounted = false;
        }
        var decodedToken = jwt.decode(token, { complete: true })
        var dateNow = new Date();

        if (decodedToken.exp < dateNow.getTime()) {
            if (mounted) {
                setLoggedIn(true)
            }
        }
        return () => mounted = false;
    }, [setLoggedIn])

    const refreshTokenSetup = (res) => {
        // Timing to renew access token
        let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

        const refreshToken = async () => {
            const newAuthRes = await res.reloadAuthResponse();
            refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
            // saveUserToken(newAuthRes.access_token);  <-- save new token
            localStorage.setItem('authToken', newAuthRes.id_token);

            // Setup the other timer after the first one
            setTimeout(refreshToken, refreshTiming);
        };

        // Setup first refresh timer
        setTimeout(refreshToken, refreshTiming);
    };

    const onFailure = (response) => {
        console.log(response);
    }

    const onLoginSuccess = (response) => {
        ApiClient.post("/login", { token: response.tokenObj.id_token })
            .then(res => {
                window.localStorage.setItem('authToken', res.data.token);
                ApiClient.defaults.headers.Authorization = "Bearer " + res.data.token;
                setLoggedIn(true)
            })
            .catch(error => {
                console.log("Authentication failed")
            })
        refreshTokenSetup(response);
    }

    const onLogoutSuccess = (response) => {
        window.localStorage.removeItem('authToken')
        setLoggedIn(false)
    }
    return (
        <AuthContext.Consumer>
            {({ loggedIn }) => (
                <div>
                    { loggedIn ?
                        <GoogleLogout
                            clientId="1090301103642-op1uhu99i3naegpk86siaqqf4nddn0c1.apps.googleusercontent.com"
                            buttonText='Logout'
                            onLogoutSuccess={onLogoutSuccess}
                            onFailure={onFailure}
                            theme="dark"
                        />
                        : <GoogleLogin
                            clientId="1090301103642-op1uhu99i3naegpk86siaqqf4nddn0c1.apps.googleusercontent.com"
                            buttonText="Login"
                            onSuccess={onLoginSuccess}
                            onFailure={onFailure}
                            cookiePolicy={'single_host_origin'}
                            isSignedIn={true}
                            theme="dark"
                        />
                    }
                </div>
            )}
        </AuthContext.Consumer>
    )



}

export default AuthButton;