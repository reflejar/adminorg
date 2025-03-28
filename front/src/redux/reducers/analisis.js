import { combineReducers } from 'redux';

const analizar = (state = ["proyecto"], action) => {
    switch (action.type) {
      case 'SELECT_ANALIZAR':
        return action.payload;

      default:
          return state;        
    }
  }


const agrupar_por = (state = '', action) => {
    switch (action.type) {
      case 'SELECT_AGRUPAR':
        return action.payload;

      default:
          return state;        
    }
  }


const periodo = (state = 'hoy', action) => {
    switch (action.type) {
      case 'SELECT_PERIODO':
        return action.payload;

      default:
          return state;        
    }
  }


const totalizar = (state = 'total_pesos', action) => {
    switch (action.type) {
      case 'SELECT_TOTALIZAR':
        return action.payload;

      default:
          return state;        
    }
  }


export default combineReducers({
  analizar,
  agrupar_por,
  periodo,
  totalizar
});

