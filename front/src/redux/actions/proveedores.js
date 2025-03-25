import { Service } from '@/redux/services/general';
import get from 'lodash/get';

let apiEndpoint = 'operative/parametros/deudas/';

const search = (term) => ({
    type: 'SEARCH_PROVEEDOR',
    payload: term
})

const select = proveedor => ({
    type: 'SELECT_PROVEEDOR',
    payload: proveedor
})

const get_all = () => async (dispatch) => {

    const response = await Service.get(apiEndpoint);
    if (response) {
          const proveedores = response.data.results.map(c => ({
            ...c,
            full_name: c.perfil.nombre
        })
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
            type: 'GET_PROVEEDORES',
            payload: proveedores
        });
    }
}

const send = (values) => async (dispatch) => {

    let payload = {
      titulo: values.titulo,
      is_active: true,      
      perfil: {
        nombre: values.nombre,
        razon_social: values.razon_social,
        tipo_documento: values.tipo_documento,
        numero_documento: values.numero_documento,
        mail: values.mail,
        telefono: values.telefono,
        domicilio: {
          localidad: values.localidad,
          calle: values.calle,
          numero: values.numero,
          provincia: values.provincia
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
      await dispatch(get_all())
      await dispatch({
        type: 'POST_PROVEEDOR',
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

export const proveedoresActions = {
    get_all,
    send,
    send_bulk,
    search,
    select,
}
