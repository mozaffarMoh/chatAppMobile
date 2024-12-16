import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RefreshUsersState {
  value: boolean;
}

const initialState: RefreshUsersState = {
  value: false,
};

export const refreshUsers = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsUsersRefresh: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setIsUsersRefresh } = refreshUsers.actions;
export default refreshUsers.reducer;
