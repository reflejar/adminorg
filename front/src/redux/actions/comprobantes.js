import set from 'lodash/set';
import qs from 'querystring';

import { Service } from '@/redux/services/general';

let apiEndpoint = 'operative/comprobantes';

const get = (id) => async (dispatch) => {

  const response = await Service.get(`${apiEndpoint}/${id}/`);

  if (response && response.data) {
    dispatch({
      type: 'GET_COMPROBANTE',
      payload: response.data
    });

    return response.data;
  }
};

const getList = (modulo, params) => async (dispatch) => {
  if (!modulo) {
    return null;
  }

  const query = qs.stringify({
    receipt__receipt_type__description: params.receipt_type,
    receipt__point_of_sales__number: params.point,
    receipt__receipt_number: params.numero,
    receipt__issued_date_from: params.startDate,
    receipt__issued_date_to: params.endDate,
    modulo: modulo

  });

  const response = await Service.get(apiEndpoint + '/?' + query);

  if (response.data) {
    dispatch({
      type: 'GET_COMPROBANTES',
      payload: response.data.results
    });

  }

  return response.data.results;
};

const send = (payload) => async (dispatch) => {
  set(payload, 'receipt.point_of_sales', Number(payload.receipt.point_of_sales));
  let endpoint = apiEndpoint + "/";
  if (payload.id) {
    const response = await Service.put(endpoint + payload.id + "/", payload)
    if (response.status >= 400) throw response;  
  } else {
    const response = await Service.post(endpoint, payload);
    if (response.status >= 400) throw response;
  }

  

};

const remove = (type, payload) => async (dispatch) => {
  const endpoint = apiEndpoint + type + "/" + payload + "/";
  const response = await Service.remove(endpoint);
  if (response.status >= 400) throw response.data[0];
  
};

export const comprobantesActions = {
  get,
  getList,
  send,
  remove,
};
