import { combineReducers } from 'redux';
import usersReducer from './user';
import settingsReducer from './settings';
export default rootReducer = combineReducers(
  {
    users: usersReducer,
    settings : settingsReducer
  }
);