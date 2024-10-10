import AuthenticationReducer from './AuthSlice';
import ProfileSliceReducer from './ProfileSlice';
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        auth: AuthenticationReducer,
        profile: ProfileSliceReducer,
    },
});

export default store;