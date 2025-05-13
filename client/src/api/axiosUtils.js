import axios from 'axios';

export const axiosInstance = axios.create({
  withCredentials: true,
  headers: {
    'Accept': 'application/json'
  }
});

export const axiosWrapper = async ({ url, method, data, isMultipart=false }) => {

  console.log("axiosWrapper", url, method, data, isMultipart)
  try{
    let response;
    let headers = { 'Accept': 'application/json' };
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    } else {
      // For multipart, do not set Content-Type, let Axios handle it
      console.log('[axiosWrapper] Detected multipart upload, omitting Content-Type header.');
    }

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
            console.log('[axiosWrapper] Sending FormData payload:', data);
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

    console.log("response", response)

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