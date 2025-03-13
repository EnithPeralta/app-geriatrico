import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Usa localStorage
import { authSlice, forgotPasswordSlice } from "./auth";
import { geriatricoSlice, personSlice, rolSlice, sedeSlice } from "./geriatrico";


// Configuración de persistencia para cada reducer que queremos guardar
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "person", "geriatrico", "roles", "sedes"], // Solo se persisten estos reducers
};

// Reducers persistentes
const persistedAuthReducer = persistReducer(persistConfig, authSlice.reducer);
const persistedPersonReducer = persistReducer(persistConfig, personSlice.reducer);
const persistedGeriatricoReducer = persistReducer(persistConfig, geriatricoSlice.reducer);
const persistedRolReducer = persistReducer(persistConfig, rolSlice.reducer);
const persistedSedesReducer = persistReducer(persistConfig, sedeSlice.reducer);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer, // Autenticación persistente
        forgotPassword: forgotPasswordSlice.reducer,
        person: persistedPersonReducer, // Persistimos `person`
        geriatrico: persistedGeriatricoReducer,
        roles: persistedRolReducer,
        sedes: persistedSedesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Crear el persistor
export const persistor = persistStore(store);
