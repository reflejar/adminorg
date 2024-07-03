import axios from 'axios';
import {baseUrl} from '../config';

const get = (apiEndpoint) => {
    return axios.get(baseUrl+apiEndpoint)
    .then((response) => {return response})
    .catch((err) => { return err.response });
}

const post = (apiEndpoint, payload) => {
    return axios.post(baseUrl + apiEndpoint, payload)
    .then((response) => { return response })
    .catch((err) => { return err.response });
}

export const authService = {
    get,
    post,
}
