import axios from 'axios';

export const axiosInstance = axios.create({
  withCredentials: true,
  headers: {
    'Accept': 'application/json'
  }
});

export const axiosWrapper = async ({ url, method, data, isMultipart=false }) => {
  try{
    let response;
    let headers = { 'Accept': 'application/json' };
    // console.log("[axiosWrapper] url:", url, "method:", method, "data:", data, "isMultipart:", isMultipart);
    switch (method) {
      case "get":
      case "delete":
        try {
          let resGet = await axiosInstance({
            method,
            url: `${process.env.REACT_APP_RESTAPI_SERVER_URI}/${url}`,
            headers,
            params: data,
          });
          //console.log(resGet)
          if (!resGet?.data){
            throw new Error("operation failed")
          }

          response = resGet?.data
        }
        catch (e) {
          const errorDetail = e?.response?.data;
          const reason = errorDetail?.errorReason || errorDetail?.message || "unknownReason";
          // Ensure a consistent error object structure for the caller
          return ({ success: false, error: e, errorReason: reason, message: errorDetail?.message || reason });
        }
        break

        
      case "post":
      case "patch":
      case "put":
        try {
          let axiosConfig = {
            method,
            url: `${process.env.REACT_APP_RESTAPI_SERVER_URI}/${url}`,
            headers,
            data
          };
          if (isMultipart) {
            // Remove Content-Type header for multipart
            delete axiosConfig.headers['Content-Type'];
            //console.log('[axiosWrapper] Sending FormData payload:', data);
          }
          let resPost = await axiosInstance(axiosConfig);

          if (!resPost?.data){
            throw new Error("operation failed")
          }

          response = resPost?.data
        }
        catch (e) {
          const errorDetail = e?.response?.data;
          const reason = errorDetail?.errorReason || errorDetail?.message || "unknownReason";
          // Ensure a consistent error object structure for the caller
          return ({ success: false, error: e, errorReason: reason, message: errorDetail?.message || reason });
        }
        break
      default:
        return ({ success: false, message: "Wrong method type provided", errorReason: "invalidParameters" });
    }

    if (!response?.success){
      throw new Error(response?.error ?? "Operation failed")
    }

    return response
  }
  catch(e){
    console.log("axiosWrapper error:", e)
    return ({success: false, error: e})
  }
}