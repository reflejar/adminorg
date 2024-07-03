// index.js
import { combineReducers } from "redux";


const instance = (state = null, action) => {
    switch (action.type) {
      case 'SELECT_PROVEEDOR':
        return action.payload;
        
      case 'POST_PROVEEDOR':
        return action.payload
      default:
        return state
    }
  }

const list = (state = [], action) => {
    switch (action.type) {

        case 'GET_PROVEEDORES':
            return action.payload;

        default:
            return state;
    }
}


const search = (state = '', action) => {
  switch (action.type) {
    case 'SEARCH_PROVEEDOR':
      return action.payload;

    default:
      return state
  }
};

export default combineReducers({
  list,
  search,
  instance,
});


