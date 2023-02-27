import React, { createContext, useReducer } from 'react'

const initialState = {
  accessToken: null,
  refreshToken: null,
  responses: []
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken
      }
    case 'LOGOUT':
      return {
        ...state,
        accessToken: null,
        refreshToken: null
      }
    case 'SET_RESPONSES':
      return {
        ...state,
        responses: action.payload
      }
  }
  return state
}

export const AuthContext = createContext(initialState)

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState, () => initialState)

  const login = async (username, password) => {
    try {
      const response = await fetch('https://noknok.w3b.net/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      })

      const data = await response.json()
      if (response.ok) {
        console.log('Login successful.')
        dispatch({ type: 'LOGIN', payload: { accessToken: data.accessToken, refreshToken: data.refreshToken } })
      } else {
        console.log('Login failed.')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const logout = async () => {
    const response = await fetch('https://boknok.w3b.net/logout', {
      method: 'POST',
    })
    if (response.ok) {
      console.log('Logout successful.')
    }
    dispatch({ type: 'LOGOUT' })
  }

  const setResponses = async (responses) => {
    dispatch({ type: 'SET_RESPONSES', payload: responses })
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        responses: state.responses,
        login,
        logout,
        setResponses
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
