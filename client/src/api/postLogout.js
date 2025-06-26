import { axiosWrapper } from '@api/axiosUtils'

export const postLogout = async () => {
    return axiosWrapper({
        data: {},
        method: "post",
        url: "api/identity/logout",
    })
}