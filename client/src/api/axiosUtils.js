// Copyright © FINANCE SECURITY GmbH - All rights reserved.
import axios from 'axios';

export const axiosInstance = axios.create({
    withCredentials: true
})

// TODO add restapi server uri to .env REACT_APP_RESTAPI_SERVER_URI
export const axiosWrapper = async ({ url, method, data }) => {
    switch (method) {
        case "get":
            try {
                let resGet = await axiosInstance({
                    method: 'get',
                    url: `${process.env.REACT_APP_RESTAPI_SERVER_URI}/${url}`,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    params: data,
                });
                // For GET, backend now sends { success: true, ...otherData } or { success: false, message: ... }
                // We return the whole data part for the AuthContext to check success and other fields.
                return resGet.data; // Return the whole data object from the response
            }
            catch (e) {
                const errorDetail = e?.response?.data;
                const reason = errorDetail?.errorReason || errorDetail?.message || "unknownReason";
                // Ensure a consistent error object structure for the caller
                return ({ success: false, error: e, errorReason: reason, message: errorDetail?.message || reason });
            }

        case "post":
            try {
                let resPost = await axiosInstance({
                    method: 'post',
                    url: `${process.env.REACT_APP_RESTAPI_SERVER_URI}/${url}`,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: data, // No need to JSON.stringify here, axios handles it for objects
                    // body: JSON.stringify(data) // 'body' is not a standard axios config for client requests
                });

                // Backend now includes success field in its main response data for POST too.
                // So, resPost.data should be { success: true/false, message: ..., user: ... (for login) }
                if (!resPost.data || typeof resPost.data.success === 'undefined') {
                     // This case indicates an unexpected response format from backend
                    console.error('axiosWrapper POST: Response data or success field is missing', resPost.data);
                    throw new Error("Request failed due to unexpected response format");
                }
                return resPost.data; // Return the whole data object
            }
            catch (e) {
                const errorDetail = e?.response?.data;
                const reason = errorDetail?.errorReason || errorDetail?.message || "unknownReason";
                // Ensure a consistent error object structure for the caller
                return ({ success: false, error: e, errorReason: reason, message: errorDetail?.message || reason });
            }
        default:
            return ({ success: false, message: "Wrong method type provided", errorReason: "invalidParameters" });
    }
}