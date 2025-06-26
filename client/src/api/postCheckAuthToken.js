import { axiosWrapper } from '@api/axiosUtils'

export const postCheckAuthToken = async (data) => {
    return axiosWrapper({
        data,
        method: "post",
        url: "api/identity/checkAuthToken",
    })
}