import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./slices/AuthSlice";
import InfrastuctureSlice from "./slices/InfrastuctureSlice";

const store = configureStore({
    reducer: {
        auth: AuthSlice,
        infra: InfrastuctureSlice,
    }
})

export default store