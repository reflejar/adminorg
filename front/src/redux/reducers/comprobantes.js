// index.js
import { combineReducers } from 'redux';


const instance = (state = null, action) => {
    switch (action.type) {
      case 'SELECT_COMPROBANTE':
        return action.payload;

      case 'POST_COMPROBANTE':
        return action.payload.id;
      default:
        return state
    }
  }



const list = (state = [], action) => {
    switch (action.type) {
        case 'GET_COMPROBANTES':
            return action.payload;
  
        case 'GET_COMPROBANTE':
            return [...state, action.payload];
  
        default:
            return state;
    }
  }


  export default combineReducers({
    list,
    instance
  });
  