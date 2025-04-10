import { Service } from '@/redux/services/general';

let apiEndpoint = 'operative/parametros/proyectos/';

const search = (term) => ({
    type: 'SEARCH_PROYECTO',
    term
})

const select = (id) => ({
    type: 'SELECT_PROYECTO',
    id
})



const get_all = () => async (dispatch) => {
    const response = await Service.get(apiEndpoint);
    if (response) {
        const proyectos = response.data.results.map(c => ({
            ...c,
            full_name: c.nombre
        })
        ).sort((a, b) => {
            let comparison = 0;
            if (a.nombre > b.nombre) {
                comparison = 1;
            } else if (a.nombre < b.nombre) {
                comparison = -1;
            }
            return comparison;
        });

        dispatch({
            type: 'GET_PROYECTOS',
            payload: proyectos
        });
    }
}


const send = (values) => async (dispatch) => {

    let payload = {
      titulo: values.titulo,
      nombre: values.nombre,
      taxon: values.taxon,
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
        type: 'POST_PROYECTO',
        payload: response.data
      });
    }
  
  
    return response
  };

  const send_bulk = (values) => async (dispatch) => {

    let payload = values.map(x => ({
      nombre: x.nombre,
      titulo: x.titulo,
      taxon: x.taxon,
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


export const proyectosActions = {
    get_all,
    search,
    select,
    send,
    send_bulk,
}
