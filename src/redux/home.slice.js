import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  todo: [],
  selectedTodo: {},
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    addToDo: (state, action) => {
      state.todo = action.payload;
    },
    deleteToDo: (state, action) => {
      state.todo.splice(action.payload, 1);
    },
    editToDo: (state, action) => {
      state.todo[action.payload.index] = action.payload.data;
    },
    getToDoList: (state, action) => {
      state.todo = action.payload;
    },
    setSelectedToDo: (state, action) => {
      state.selectedTodo = action.payload;
    },
  },
});

const {actions, reducer} = homeSlice;

export const {addToDo, deleteToDo, editToDo, getToDoList, setSelectedToDo} =
  actions;

export default reducer;
