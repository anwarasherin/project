import { createSlice } from "@reduxjs/toolkit";
import localStorage from "redux-persist/lib/storage";

const initialState = {
  isFetching: false,
  isAuthenticated: true,
  user: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsFetching: (state) => {
      state.isFetching = true;
    },
    login: (state, action) => {
      state.isFetching = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      localStorage.removeItem("persist:root");
      state.isFetching = false;
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { setIsFetching, login, logout } = userSlice.actions;

export default userSlice.reducer;
