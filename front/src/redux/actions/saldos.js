import { Service } from '@/redux/services/general';

const apiEndpoint = 'operative/reportes/saldos';

const get = (params) => async (dispatch) => {
  let path = `${apiEndpoint}/${params.destinatario}/?end_date=${params.fecha}`;

  const response = await Service.get(path);
  if (response && response.data) {
    if (params.save) {
      dispatch({
        type: 'GET_SALDOS',
        payload: response.data.data
      })
    }
    return response.data
  }
};

export const saldosActions = {
  get
};
