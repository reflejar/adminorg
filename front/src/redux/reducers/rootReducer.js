import { combineReducers } from "redux";

import { reducer as toastrReducer } from "react-redux-toastr";

import clientes from './clientes';
import proveedores from './proveedores';
import ingresos from './ingresos';
import gastos from './gastos';
import cajas from './cajas';
import configuraciones from './configuraciones';
import contabilidad from './contabilidad';
import titulos from './titulos';
import puntos from './puntos';
import proyectos from './proyectos';
import movimientos from './movimientos';
import comprobantes from './comprobantes';
import saldos from './saldos';
import analisis from './analisis';

const appReducer = combineReducers({
   toastr: toastrReducer, // <- Mounted at toastr.
   clientes,
   analisis,
   proveedores,
   ingresos,
   gastos,
   cajas,
   proyectos,
   contabilidad,
   configuraciones,
   titulos,
   puntos,
   movimientos,
   comprobantes,
   saldos,
});

const rootReducer = (state, action) => {
   return appReducer(state, action);
}

export default rootReducer;
