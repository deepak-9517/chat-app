import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetail: {},
  token: null,
  onlineUser: [],
  socketConnection: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetail: (state, action) => {
      state.userDetail = action.payload;
    },

    setToken: (state, action) => {
      state.token = action.payload;
    },

    setLogout: (state, action) => {
      state.userDetail = {};
      state.token = null;
      state.onlineUser = [];
      state.socketConnection = null;
    },

    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },

    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
  },
});

export const {
  setUserDetail,
  setToken,
  setLogout,
  setOnlineUser,
  setSocketConnection,
} = userSlice.actions;

export default userSlice.reducer;
