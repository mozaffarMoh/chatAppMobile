import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UsersSliceState {
    users: any;
}

const initialState: UsersSliceState = {
    users: [],
};

export const usersSlice = createSlice({
    name: "usersSlice",
    initialState,
    reducers: {
        setUsersSlice: (state, action: PayloadAction<string>) => {
            state.users = action.payload;
        },
    },
});

export const { setUsersSlice } = usersSlice.actions;
export default usersSlice.reducer;
