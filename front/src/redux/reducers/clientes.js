// index.js
import { combineReducers } from 'redux';


const instance = (state = null, action) => {
    switch (action.type) {
      case 'SELECT_CLIENTE':
        return action.payload;

      case 'POST_CLIENTE':
        return action.payload;
      default:
        return state
    }
  }


const list = (state = [], action) => {
    switch (action.type) {

        case 'GET_CLIENTES':
            return action.payload;

        default:
            return state;
    }
}

const archived = (state = [], action) => {
  switch (action.type) {

      case 'GET_ARCHIVED_CLIENTES':
          return action.payload;

      default:
          return state;
  }
}


const search = (state = '', action) => {
  switch (action.type) {
    case 'SEARCH_CLIENTE':
      return action.payload;

    default:
      return state
  }
};




export default combineReducers({
  instance,
  list,
  archived,
  search,
});
