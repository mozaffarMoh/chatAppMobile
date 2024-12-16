import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface isProfileUpdatedState {
  value: boolean;
}

const initialState: isProfileUpdatedState = {
  value: false,
};

export const isProfileUpdated = createSlice({
  name: "isProfileUpdated",
  initialState,
  reducers: {
    setIsProfileUpdated: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setIsProfileUpdated } = isProfileUpdated.actions;
export default isProfileUpdated.reducer;
