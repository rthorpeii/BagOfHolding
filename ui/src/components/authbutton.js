import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { Button } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

import ApiClient from './api-client'
import AuthContext from './authcontext.js'

export default function AuthButton() {
    const { setLoggedIn } = useContext(AuthContext)
    useEffect(() => {
        let mounted = true;
        const token = localStorage.getItem('authToken');
        if (token === null) {
            if (mounted) {
                setLoggedIn(false)
            }
        } else {
            if (mounted) {
                setLoggedIn(true)
            }
        }

        return () => mounted = false;
    }, [setLoggedIn])


    // Function that will be called to refresh authorization
    const refreshAuthLogic = failedRequest => ApiClient.get('/refresh').then(tokenRefreshResponse => {
        localStorage.setItem('authToken', tokenRefreshResponse.data.token);
        ApiClient.defaults.headers.Authorization = "Bearer " + tokenRefreshResponse.data.token;
        failedRequest.response.config.headers['Authorization'] = 'Bearer ' + tokenRefreshResponse.data.token;
        return Promise.resolve();
    }).catch(error => {
        console.log("Authentication failed", error)
        setLoggedIn(false)
    });

    // Instantiate the interceptor (you can chain it as it returns the axios instance)
    createAuthRefreshInterceptor(ApiClient, refreshAuthLogic);

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
                            render={renderProps => (
                                <Button
                                    variant="contained"
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                >Logout</Button>
                            )}
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
