import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./slice/userReducer";

const store = configureStore({
  reducer: rootReducer,
});

export default store;
