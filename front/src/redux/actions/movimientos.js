import { Service } from '@/redux/services/general';

let apiEndpoint = 'operative/reportes/movimientos';

const get = (params) => async (dispatch) => {
  let path = `${apiEndpoint}/${params.destinatario}/?end_date=${params.fecha}`;
  if (params.titulo) {
    path = path + `&titulo=${params.titulo}`
  }
  const response = await Service.get(path);
  if (response && response.data) {
    if (params.save) {
      dispatch({
        type: 'GET_MOVIMIENTOS',
        payload: response.data.data
      });
    }
    return response.data
  }
};

export const movimientosActions = {
  get
};
