// index.js
import { combineReducers } from "redux";

const instance = (state = null, action) => {
    switch (action.type) {
      case 'SELECT_GASTO':
        return action.id
      case 'POST_GASTO':
        return action.payload.id
      default:
        return state
    }
  }



const list = (state = [], action) => {
    switch (action.type) {

        case 'GET_GASTOS':
            return action.payload;

        default:
            return state;
    }
}

const search = (state = '', action) => {
    switch (action.type) {
      case 'SEARCH_GASTO':
        return action.term
      default:
        return state
    }
}


export default combineReducers({
  list,
  search,
  instance,
});