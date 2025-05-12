import axios from 'axios';

export const axiosInstance = axios.create({
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

/**
 * Wrapper évolué pour toutes les requêtes HTTP
 * @param {Object} options
 * @param {string} options.url    - Segment ou URL absolue (préfixée dynamiquement) de l'endpoint
 * @param {string} options.method - 'get'|'post'|'put'|'delete'|'patch'
 * @param {Object} [options.data]   - Payload pour POST/PUT/PATCH
 * @param {Object} [options.params] - Query parameters pour GET/DELETE
 * @returns {Promise<Object>}       - { success: boolean, ...payload }
 */
export const axiosWrapper = async ({ url, method, data = {}, params = {} }) => {
  const base = process.env.REACT_APP_RESTAPI_SERVER_URI || '';
  // Construction de l'URL complète
  const fullUrl = url.startsWith('http')
    ? url
    : `${base.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`;

  try {
    let response;
    switch (method.toLowerCase()) {
      case 'get':
        response = await axiosInstance.get(fullUrl, { params });
        break;
      case 'delete':
        response = await axiosInstance.delete(fullUrl, { params });
        break;
      case 'post':
        response = await axiosInstance.post(fullUrl, data);
        break;
      case 'put':
        response = await axiosInstance.put(fullUrl, data);
        break;
      case 'patch':
        response = await axiosInstance.patch(fullUrl, data);
        break;
      default:
        return { success: false, message: 'Wrong method type provided' };
    }

    const payload = response.data;
    // Vérification du champ success dans la payload
    if (typeof payload.success === 'undefined') {
      console.warn('axiosWrapper: response lacks success flag', payload);
      return { success: false, message: 'Unexpected response format', payload };
    }
    return payload;
  } catch (e) {
    // Gestion unifiée des erreurs
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
