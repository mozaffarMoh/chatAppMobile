import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ActiveThemeState {
    value: string;
}

const initialState: ActiveThemeState = {
    value: "",
};

export const ActiveTheme = createSlice({
    name: "ActiveTheme",
    initialState,
    reducers: {
        setActiveTheme: (state, action: PayloadAction<string>) => {
            state.value = action.payload;
        },
    },
});

export const { setActiveTheme } = ActiveTheme.actions;
export default ActiveTheme.reducer;
