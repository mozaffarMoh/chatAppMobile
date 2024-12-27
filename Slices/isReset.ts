import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface isResetState {
  value: boolean;
}

const initialState: isResetState = {
  value: false,
};

export const isReset = createSlice({
  name: "isReset",
  initialState,
  reducers: {
    setIsReset: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setIsReset } = isReset.actions;
export default isReset.reducer;
