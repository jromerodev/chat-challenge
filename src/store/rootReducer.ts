import {combineReducers} from '@reduxjs/toolkit';

import counterReducer from '../slices/counterSlice';
import usersReducer from '../slices/usersSlice';
import appReducer from '../slices/appSlice';

const rootReducer = combineReducers({
  counter: counterReducer,
  users: usersReducer,
  app: appReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
