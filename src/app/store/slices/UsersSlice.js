import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import AxiosObj from "../../axios/AxiosObj";


export const fetchAllUsers = createAsyncThunk('fetchAllUsers', async () => {
    const response = await AxiosObj.get('get-all-users.php')
    return response.data
})

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        mydata: null,
        loading: false,
        error: false,
    },
    // these are action to be performed
    reducers: {

        deleteData(state, action) {
            state.mydata = []
        },
        login(state, action) {
            state.isLoggedIn = true
        }
    },
    // for async task
    extraReducers: builder => {
        builder
            .addCase(fetchAllUsers.pending, (state, action) => {
                state.loading = true
                console.log('pending')
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.mydata = action.payload;
                console.log(action.payload)
                if (action.payload.error)
                    state.error = true
                else {
                    state.error = false
                }
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                console.log('rejected')
            });
    }
})

export const { deleteData } = usersSlice.actions
export default AuthSlice.reducer