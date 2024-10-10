import { createSlice } from '@reduxjs/toolkit'


// Get the token from localStorage if it exists
var token = localStorage.getItem('token')

const initialState = {
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
  };
  

const AuthSlice = createSlice({
    name: 'Authentication',
    initialState,
    reducers: {
        loginReducer: (state, action) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            console.log("nsns",action.payload.token)

            localStorage.setItem('token',action.payload.token);

        },

        logoutReducer: (state, action) => {
            state.token = null;
            state.isAuthenticated = false;

            localStorage.removeItem('token')
        }
    }

});



export const { loginReducer, logoutReducer} = AuthSlice.actions;
export default AuthSlice.reducer;