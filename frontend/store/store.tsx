import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productReducer from "../slices/productSlice.ts";
import userSlice from "../slices/userSlice.ts";

const rootReducer = combineReducers({
	user: userSlice,
	product: productReducer,
});

export const store = configureStore({
	reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
