import axios from 'axios';
import {baseUrl, initialHeaders} from '../config';

import { toast } from 'react-toastify';

const extractErrorMessages = (data, currentKey = "") => { // Improved function with optional currentKey
  const messages = [];
  for (const key in data) {
    const value = data[key];
    const newKey = currentKey ? `${currentKey}.${key}` : key; // Build complete key
  
    if (typeof value === "string") {
      messages.push(`${newKey}: ${value}`);
    } else if (Array.isArray(value)) { // Exclude arrays
      messages.push(`${newKey}: ${value[0]}`);
    } else if (typeof value === "object") { // Exclude arrays
      messages.push(...extractErrorMessages(value, newKey));
    }
  }
  return messages;
};


const get = (apiEndpoint, responseType='json') => {
    let headers = initialHeaders();
    return axios.get(
        baseUrl+apiEndpoint, 
        { headers, responseType }
    )
    .then((response) => {return response})
}


const remove = (apiEndpoint) => {
    let headers = initialHeaders();
    return axios.delete(baseUrl+apiEndpoint, { headers })
    .then((response) => {return response})
    .catch((err) => { return err.response });
}

const post = (apiEndpoint, payload) => {
    let headers = initialHeaders();
    return axios.post(baseUrl + apiEndpoint, payload, { headers })
      .then((response) => {
        toast.success("Guardado con éxito", {
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        return response;
      })
      .catch((err) => {
        const errorMessages = extractErrorMessages(err.response.data);
        errorMessages.forEach(message => {
            toast.error(message, {
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "colored",
            });
            
        });
        return err.response.data
      });
  };

const postMultiData = (apiEndpoint, payload) => {
    let headers = initialHeaders();
    headers['Content-Type'] = 'multipart/form-data';
    return axios.post(baseUrl + apiEndpoint, payload, { headers })
    .then((response) => { return response })
    .catch((err) => { return err.response });
}

const put = (apiEndpoint, payload) => {
    let headers = initialHeaders();
    return axios.put(baseUrl + apiEndpoint, payload, { headers })
    .then((response) => {
      toast.success("Guardado con éxito", {
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return response;
    })
    .catch((err) => {
      const errorMessages = extractErrorMessages(err.response.data);
      errorMessages.forEach(message => {
          toast.error(message, {
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
          
      });
      return err.response.data
    });
}

export const Service = {
    get,
    remove,
    post,
    put,
    postMultiData,
}
