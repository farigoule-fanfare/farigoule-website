import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@context/auth";

import Loading from "@components/utils/Loading";

//A reusable component to protect private pages if user not authenticated

// TODO check if has required role from user data
function RequireAuth(props) {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, checkIfUserIsAuthenticated } = useAuth();

    // loading, only used if "private page" while doing auth check
    const [loading, setLoading] = useState(true)

    // If it's a private page, first check if user is authenticated
    // Run the code every minute to logout the user if the session has expired
    useEffect(() => {
        if (props.privatePage) {
            checkAuth(true)

            const checkAuthTimeout = setInterval(function () {
                checkAuth(false)
            }, 60000);

            return () => {
                clearInterval(checkAuthTimeout);
            }
        }
        // Do not add "checkAuth" to dependencies
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, location, props.privatePage])

    // Check if user is authenticated. 
    // if he isn't, he get logged out (and redirected to public page)
    // If he is, check if he has the required role
    const checkAuth = async (shouldRefreshToken = true) => {
        if (user.loading) return

        try {
            const auth = await checkIfUserIsAuthenticated(false, true, shouldRefreshToken)
            // If not authenticated or error redirect to login page
            if (!auth || !auth.id) {
                navigate({
                    to: `/`
                })
            }

            if (!loading) {
                return
            }

            // TODO check if has required role from user data
            // Some pages require role "admin"
            const hasRequiredRole = true


            if (!hasRequiredRole) {
                navigate(`/`)
            }

            // Has required role
            setLoading(false)
        }
        catch (e) {
            navigate({
                to: `/`,
                options: {
                    state: { referer: location }
                }
            })
        }
    }

    // If is a public page, return the component without further checks
    if (!props.privatePage) {
        return (
            props.children
        )
    }

    // If user data is still loading
    if ((user && user.loading) || loading) {
        return <Loading />
    }

    return (props.children)
}

RequireAuth.propTypes = {
    privatePage: PropTypes.bool,
    requiredRole: PropTypes.array
}

export default RequireAuth