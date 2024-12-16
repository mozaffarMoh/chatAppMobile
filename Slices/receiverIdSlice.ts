import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ReceiverIdState {
  value: string;
}

const initialState: ReceiverIdState = {
  value: "",
};

export const receiverId = createSlice({
  name: "receiverId",
  initialState,
  reducers: {
    setReceiverId: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setReceiverId } = receiverId.actions;
export default receiverId.reducer;
