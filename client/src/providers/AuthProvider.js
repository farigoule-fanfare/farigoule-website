import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { AuthContext } from "@context/auth";

import { postCheckAuthToken } from "@api/postCheckAuthToken"
import { postLogout } from "@api/postLogout"

function AuthProvider(props) {
    const navigate = useNavigate()
    const [user, setUser] = useState({ loading: true })
    const [loading, setLoading] = useState(true)

    const setUserFunction = useCallback((user = { loading: false }) => {
        localStorage.setItem("FarigouleToken", JSON.stringify(user));
        setUser(user)
    }, [])


    const logout = async () => {
        try {
            const d = await postLogout()

            if (!d?.success) {
                throw new Error("Failed to logout")
            }
        }
        catch (e) {
        }
        finally {
            // Remove tokens from localStorage what allow application to know who you are
            localStorage.removeItem("FarigouleToken");
            // Remove information from state what allow application to know who you are
            setUserFunction();
            // Will redirect you to home
            navigate(`/`, {
                replace: false,
            })
        }
    }

    const checkIfUserIsAuthenticated = async (thenSetUser = true, logoutOnFail = true, shouldRefreshToken = true) => {
        let storedUser = JSON.parse(
            localStorage.getItem("FarigouleToken")
        )

        if (!storedUser) {
            if (logoutOnFail) {
                logout()
            }
            else {
                setUserFunction()
            }
            setLoading(false)
            return ({})
        }

        else {
            try {
                const isTokenValid = await postCheckAuthToken({ shouldRefreshToken })

                if (!isTokenValid || !isTokenValid.success) {
                    throw new Error("Token is expired or not valid")
                }

                // TODO set user based on data returned by postCheckAuthToken
                let newUser = {}

                if (thenSetUser) {
                    setUserFunction(newUser)
                }
                setLoading(false)
                return (newUser)
            }
            catch (e) {
                logout()
                setLoading(false)
                return ({})
            }
        }
    }

    // // On component mount, load saved "User" 
    useEffect(() => {
        checkIfUserIsAuthenticated(true, false)
        // eslint-disable-next-line
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                setUserFunction,
                logout,
                checkIfUserIsAuthenticated
            }}
        >
            {props.children}
        </ AuthContext.Provider>
    )
}

export default AuthProvider