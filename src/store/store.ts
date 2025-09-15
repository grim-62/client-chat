// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slice/user.slice";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import chatSlice, {} from "./slice/chatSlice";
// 1. Combine reducers
const rootReducer = combineReducers({
  users: userSlice.reducer,
  chat: chatSlice,
});

// 2. Setup persist config
const persistConfig = {
  key: "root",
  storage,
};

// 3. Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

// 5. Create persistor
export const persistor = persistStore(store);

// 6. Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
