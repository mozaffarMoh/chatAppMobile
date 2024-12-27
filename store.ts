import { configureStore } from "@reduxjs/toolkit";
import receiverIdReducer from './Slices/receiverIdSlice';
import refreshUsersReducer from './Slices/refreshUsers';
import CallerNameReducer from './Slices/callerNameSlice';
import isProfileUpdatedReducer from './Slices/isProfileUpdated';
import isResetReducer from './Slices/isReset';
import usersSliceReducer from './Slices/usersSlice';



const store = configureStore({
    reducer: {
        id: receiverIdReducer,
        CallerName: CallerNameReducer,
        refreshUsers: refreshUsersReducer,
        isProfileUpdated: isProfileUpdatedReducer,
        isReset: isResetReducer,
        usersSlice: usersSliceReducer,
    }
})

export type RootType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;