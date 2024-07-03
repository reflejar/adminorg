// index.js
import { combineReducers } from "redux";


const instance = (state = null, action) => {
    switch (action.type) {
      case 'SELECT_PARAMETRO':
        return action.id
      case 'POST_PARAMETRO':
        return action.payload.id
      default:
        return state
    }
  }



const list = (state = [], action) => {
    switch (action.type) {

        case 'GET_PARAMETROS':
            return action.payload;

        default:
            return state;
    }
}

export default combineReducers({
  list,
  instance,
});
