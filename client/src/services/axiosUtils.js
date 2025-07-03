import axios from 'axios';

export const axiosInstance = axios.create({
  withCredentials: true,
  headers: {
    'Accept': 'application/json'
  }
});

export const axiosWrapper = async ({ url, method, data, isMultipart = false }) => {
  try {
    const fullUrl = `${process.env.REACT_APP_RESTAPI_SERVER_URI}/${url}`;
    const headers = { 'Accept': 'application/json' };

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
      throw new Error("Méthode HTTP invalide");
    }

    const res = await axiosInstance(axiosConfig);
    return { data: res.data };
  } catch (e) {
    const message = e?.response?.data?.message || e.message || "Erreur inconnue";
    e.message = message; // utile si on relance l'erreur
    throw e;
  }
};
