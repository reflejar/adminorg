// index.js
import { combineReducers } from 'redux';

const list = (state = [], action) => {
    switch (action.type) {

        case 'GET_PUNTOS':
            return action.payload;

        default:
            return state;
    }
}

export default combineReducers({
    list
  });
  