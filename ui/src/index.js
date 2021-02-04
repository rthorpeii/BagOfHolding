import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthContext from './components/authcontext'

const AppWrapper = () => {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </AuthContext.Provider>
  )
}

ReactDOM.render(
  <AppWrapper />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
