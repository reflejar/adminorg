import { Service } from "@/redux/services/general";
import moment from "moment";
import qs from 'querystring';

let apiEndpoint = 'operative/reportes/analisis';


const selectAnalizar = (tipos) => ({
    type: 'SELECT_ANALIZAR',
    payload: tipos
})

const selectAgrupar = (tipo) => ({
    type: 'SELECT_AGRUPAR',
    payload: tipo
})

const selectColumna = (tipo) => ({
    type: 'SELECT_PERIODO',
    payload: tipo
})

const selectTotalizar = (tipo) => ({
    type: 'SELECT_TOTALIZAR',
    payload: tipo
})

const fetchData = (params) => async (dispatch) => {
    const query = qs.stringify({
        start_date: '',
        end_date: moment(new Date()).format('YYYY-MM-DD'),
        analizar: params.analizar.join(","),
        agrupar_por: params.agrupar_por || '', 
        periodo: params.periodo  || 'hoy', 
        totalizar: params.totalizar
    })
    const response = await Service.get(apiEndpoint + '/?' + query);

    if (response && response.data) {
        return response.data
      }

  
    return;
  };


export const analisisActions = {
    selectAnalizar,
    selectAgrupar,
    selectColumna,
    selectTotalizar,
    fetchData
}
