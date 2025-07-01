import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { AuthContext } from "@context/auth";

import { postCheckAuthToken } from "@services/postCheckAuthToken"
import { postLogout } from "@services/postLogout"

import Loading from "@components/utils/Loading"

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
            await axiosWrapper({ method: 'post', url: 'api/auth/logout' });
        } catch (e) {
            console.warn("Logout échoué côté serveur (ignoré côté client)", e);
        } finally {
            // Nettoyage local, quoi qu’il arrive
            localStorage.removeItem("FarigouleToken");
            setUserFunction();
            navigate(`/`, { replace: false });
        }
    };


    const checkIfUserIsAuthenticated = async (thenSetUser = true, logoutOnFail = true, shouldRefreshToken = true) => {
        const storedUser = JSON.parse(localStorage.getItem("FarigouleToken"));

        if (!storedUser || !storedUser?.id) {
            if (logoutOnFail) logout();
            else setUserFunction();
            setLoading(false);
            return {};
        }

        try {
            const res = await axiosWrapper({
            method: 'post',
            url: 'api/auth/check-token',
            data: { shouldRefreshToken }
            });

            // TODO: set user from res.data (à adapter si le backend renvoie l'user ici)
            const newUser = res.data || {};

            if (thenSetUser) setUserFunction(newUser);
            setLoading(false);
            return newUser;

        } catch (e) {
            if (logoutOnFail) logout();
            setUserFunction();
            setLoading(false);
            return {};
        }
    };


    // // On component mount, load saved "User" 
    useEffect(() => {
        checkIfUserIsAuthenticated(true, false)
        // eslint-disable-next-line
    }, [])

    if (loading) {
        return (
            <Loading />
        )
    }

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