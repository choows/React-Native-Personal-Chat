import { combineReducers } from 'redux';
import usersReducer from './user';
export default rootReducer = combineReducers(
  {
    users: usersReducer
  }
);