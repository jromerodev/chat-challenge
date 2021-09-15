// export * from './binnacle';
// export * from './chat';
// export * from './journal';
// export * from './routine';
// export * from './session';
// export * from './settings';
// export * from './ui';
// export { default as rootReducer } from './reducer';
// export { default as store } from './store';

// import { configureStore, Action } from '@reduxjs/toolkit';
// import { persistReducer, persistStore } from 'redux-persist';
// // middleware
// import thunk, { ThunkAction } from 'redux-thunk';
// import logger from 'redux-logger';
// // storage
// import AsyncStorage from '@react-native-async-storage/async-storage';
// // root reducer
// import rootReducer, { RootState } from './rootReducer';

// export type AppDispatch = typeof store.dispatch;
// export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

// const persistConfig = {
//     storage: AsyncStorage,
//     timeout: 0,
//     key: 'my_app',
//     whitelist: []
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = configureStore({
//     reducer: persistedReducer,
//     middleware: [thunk, logger],
//     devTools: process.env.NODE_ENV !== 'production'
// });

// export const persistor = persistStore(store);

// export default store;
