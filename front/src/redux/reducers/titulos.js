// index.js
import { combineReducers } from 'redux';



const instance = (state = null, action) => {
    switch (action.type) {
      case 'SELECT_TITULO':
        return action.payload;

      case 'POST_TITULO':
        return action.payload.id;
      default:
        return state
    }
  }

  

const list = (state = [], action) => {
    switch (action.type) {

        case 'GET_TITULOS':
            return action.payload;

        case 'GET_TITULO':
            return [...state, action.payload];

        default:
            return state;
    }
}



const search = (state = '', action) => {
  switch (action.type) {
    case 'SEARCH_TITULO':
      return action.payload;

    default:
      return state
  }
};


export default combineReducers({
  list,
  search,
  instance
});

