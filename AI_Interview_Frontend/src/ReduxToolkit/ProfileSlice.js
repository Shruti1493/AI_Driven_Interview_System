import { createSlice } from '@reduxjs/toolkit'


// Get the  userData from localStorage if it exists
 
const userData = localStorage.getItem('userData')

const initialState = {
    userData: userData ? userData: null,
};


const ProfileSlice = createSlice({
    name: 'ProfileData',
    initialState,
    reducers: {
        StoreProfileData: (state, action) => {         
            
            localStorage.setItem('userData', JSON.stringify(action.payload.data))
            state.userData = localStorage.getItem('userData');        
            console.log(state.userData)

        },

        RemoveProfileData: (state, action) => {        
            state.userData = null;
            localStorage.removeItem('userData')
        }
    }

});


export const { StoreProfileData, RemoveProfileData} = ProfileSlice.actions;
export default ProfileSlice.reducer;