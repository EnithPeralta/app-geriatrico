import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    rolSeleccionado: null,
    error: null,
    loading: false,
};

export const rolSlice = createSlice({
    name: "rol",
    initialState,
    reducers: {
        startSeleccion: (state) => {
            state.loading = true;
            state.error = null;
        },
        setRolSeleccionado: (state, action) => {
            state.rolSeleccionado = action.payload;
            state.loading = false;
        },
        setRolError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { startSeleccion, setRolSeleccionado, setRolError } = rolSlice.actions;
