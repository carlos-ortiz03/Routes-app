import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import routesReducer from "./slices/routesSlice";

const store = configureStore({
  reducer: {
    routes: routesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
