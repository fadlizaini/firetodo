import {configureStore} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import homeSlice from './home.slice';

const store = configureStore({
  reducer: {homeState: homeSlice},
  middleware: [thunk],
});

export default store;
