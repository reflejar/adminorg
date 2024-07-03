// index.js
import { combineReducers } from 'redux';



const instance = (state = null, action) => {
    switch (action.type) {
      case 'SELECT_CONTABILIDAD':
        return action.payload;

      default:
        return state
    }
  }


export default combineReducers({
  instance
});
