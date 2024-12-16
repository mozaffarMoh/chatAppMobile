import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CallerNameState {
    value: string;
}

const initialState: CallerNameState = {
    value: "",
};

export const CallerName = createSlice({
    name: "CallerName",
    initialState,
    reducers: {
        setCallerName: (state, action: PayloadAction<string>) => {
            state.value = action.payload;
        },
    },
});

export const { setCallerName } = CallerName.actions;
export default CallerName.reducer;
