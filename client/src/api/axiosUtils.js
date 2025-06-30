import axios from 'axios';

export const axiosInstance = axios.create({
  withCredentials: true,
  headers: {
    'Accept': 'application/json'
  }
});

export const axiosWrapper = async ({ url, method, data, isMultipart = false }) => {
  try {
    let response;
    let headers = { 'Accept': 'application/json' };

    const fullUrl = `${process.env.REACT_APP_RESTAPI_SERVER_URI}/${url}`;
    const axiosConfig = {
      method,
      url: fullUrl,
      headers,
    };

    if (['get', 'delete'].includes(method)) {
      axiosConfig.params = data;
    } else if (['post', 'patch', 'put'].includes(method)) {
      axiosConfig.data = data;
      if (isMultipart) {
        delete axiosConfig.headers['Content-Type']; // Let browser set it
      }
    } else {
      return {
        success: false,
        message: "Wrong method type provided",
        errorReason: "invalidParameters"
      };
    }

    const res = await axiosInstance(axiosConfig);
    const httpStatus = res.status;
    const body = res.data;

    // ✅ Si le corps contient un champ "success", on garde l'ancien comportement
    if (typeof body === 'object' && body !== null && 'success' in body) {
      if (body.success) {
        return body;
      } else {
        throw new Error(body.message || "Operation failed");
      }
    }

    // ✅ Sinon on suppose que c'est une réponse nouvelle version, basée sur les codes HTTP
    if (httpStatus >= 200 && httpStatus < 300) {
      return { data: body }; // nouvelle interface
    } else {
      throw new Error(body?.message || "Operation failed");
    }

  } catch (e) {
    const errorDetail = e?.response?.data;
    const reason = errorDetail?.errorReason || errorDetail?.message || e.message || "unknownReason";

    return {
      success: false,
      error: e,
      errorReason: reason,
      message: errorDetail?.message || reason
    };
  }
};
