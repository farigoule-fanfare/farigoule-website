import axios from 'axios';

export const axiosWrapper = async ({
  url,
  method,
  data = {},
  params = {},
  isMultipart = false
}) => {
  const base = process.env.REACT_APP_RESTAPI_SERVER_URI || '';
  const fullUrl = url.startsWith('http')
    ? url
    : `${base.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`;

  // Configuration commune
  const config = {
    withCredentials: true,
    params,
    headers: {}
  };

  if (isMultipart) {
    // Laisse le navigateur fixer le bon Content-Type (avec boundary)
    // On ne met **pas** application/json
  } else {
    config.headers['Content-Type'] = 'application/json';
  }

  try {
    let response;
    switch (method.toLowerCase()) {
      case 'get':
        response = await axios.get(fullUrl, config);
        break;
      case 'delete':
        response = await axios.delete(fullUrl, config);
        break;
      case 'post':
        response = await axios.post(fullUrl, data, config);
        break;
      case 'put':
        response = await axios.put(fullUrl, data, config);
        break;
      case 'patch':
        response = await axios.patch(fullUrl, data, config);
        break;
      default:
        return { success: false, message: 'Wrong method type provided' };
    }

    const payload = response.data;
    if (typeof payload.success === 'undefined') {
      console.warn('axiosWrapper: response lacks success flag', payload);
      return { success: false, message: 'Unexpected response format', payload };
    }
    return payload;

  } catch (e) {
    const errorDetail = e.response?.data || {};
    const reason = errorDetail.errorReason || errorDetail.message || e.message;
    return {
      success: false,
      message: reason,
      status: e.response?.status || null,
      error: e
    };
  }
};
