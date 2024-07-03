import { Service } from '@/redux/services/general';
import get from 'lodash/get';

const apiEndpoint = 'operative/parametros/cliente/';

const search = (term) => ({
  type: 'SEARCH_CLIENTE',
  payload: term
});

const select = client => ({
  type: 'SELECT_CLIENTE',
  payload: client
});

const get_all = (args) => async (dispatch) => {
  const response = await Service.get(apiEndpoint + (args && args.archived ? '?archived=1': ''));
  if (response) {
    const clientes = response.data.results.map(c => {
      const {perfil} = c;
      let full_name = get(perfil, 'razon_social', "");
      if (!full_name) {
          full_name = get(perfil, 'nombre', "")
      }
      return ({...c, full_name})
  }
    ).sort((a, b) => {
      let comparison = 0;
      if (a.full_name > b.full_name) {
        comparison = 1;
      } else if (a.full_name < b.full_name) {
        comparison = -1;
      }
      return comparison;
    });

    dispatch({
      type: 'GET_CLIENTES',
      payload: clientes
    });
  }
};

const send = (values) => async (dispatch) => {

  let payload = {
    titulo: values.titulo,
    is_active: true,
    perfil: {
      nombre: values.nombre,
      razon_social: values.razon_social,
      tipo_documento: values.tipo_documento,
      numero_documento: values.numero_documento,
      fecha_nacimiento: null,
      es_extranjero: values.es_extranjero,
      mail: values.mail,
      telefono: values.telefono,
      domicilio: {
        localidad: values.domicilio_localidad,
        calle: values.domicilio_calle,
        numero: values.domicilio_numero,
        provincia: values.domicilio_provincia
      },
    },
  };

  let response;

  if (values.id) {
    response = await Service.put(apiEndpoint + values.id + '/', payload);
  } else {
    response = await Service.post(apiEndpoint, payload);
  }
  
  if (response) {
    await dispatch(get_all());
    await dispatch({
      type: 'POST_CLIENTE',
      payload: response.data
    });
  }
  return response
};

const send_bulk = (values) => async (dispatch) => {

  let payload = values.map(x => ({
    titulo: x.titulo,
    perfil: {
      nombre: x.nombre,
      razon_social: x.razon_social,
      tipo_documento: x.tipo_documento,
      numero_documento: x.numero_documento,
      fecha_nacimiento: null,
      es_extranjero: x.es_extranjero,
      mail: x.mail,
      telefono: x.telefono,
      domicilio: {
        localidad: x.domicilio_localidad,
        calle: x.domicilio_calle,
        numero: x.domicilio_numero,
        provincia: x.domicilio_provincia
      },
    },
  }))

  let response;
  
  response = await Service.post(apiEndpoint, payload);
  if (response) {
    await dispatch(get_all());
    response.result = 'success'
  } else {
    response = {
      result: 'error'
    }
  }
  return response
};


export const clientesActions = {
  get_all,
  send,
  send_bulk,
  search,
  select,
};
