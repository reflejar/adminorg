// index.js
import { combineReducers } from "redux";


const instance = (state = null, action) => {
    switch (action.type) {
      case 'SELECT_PROYECTO':
        return action.id
      case 'POST_PROYECTO':
        return action.payload.id
      default:
        return state
    }
  }



const list = (state = [], action) => {
    switch (action.type) {

        case 'GET_PROYECTOS':
            return action.payload;

        default:
            return state;
    }
}

const search = (state = '', action) => {
    switch (action.type) {
      case 'SEARCH_PROYECTO':
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