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
                })

                return ({ success: true, data: resGet.data.data, response: resGet })
            }
            catch (e) {
                const errorReason = e?.response?.data?.errorReason ?? "unknownReason"
                return ({ success: false, error: e, errorReason: errorReason })
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
                    data: JSON.stringify(data),
                    body: JSON.stringify(data)
                })

                if (!resPost.data || !resPost.data.success) {
                    throw new Error("Request failed");
                }

                return (resPost.data)
            }
            catch (e) {
                const errorReason = e?.response?.data?.errorReason ?? "unknownReason"
                return ({ success: false, error: e, errorReason: errorReason })
            }
        default:
            return ({ success: false, error: "Wrong method type provided", errorReason: "invalidParameters" })

    }
}