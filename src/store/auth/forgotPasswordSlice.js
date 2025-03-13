import { createSlice } from '@reduxjs/toolkit';

// Definición del slice
export const forgotPasswordSlice = createSlice({
    name: 'forgotPassword',  // Nombre del slice para identificarlo
    initialState: {
        loading: false,  // Estado de carga inicial
        message: "",     // Mensaje que se muestra tras una solicitud exitosa
        error: null,     // Error si la solicitud falla
    },

    reducers: {
        // Acción para iniciar la solicitud
        requestStart: (state) => {
            state.loading = true;   // Establece loading en true cuando empieza la solicitud
            state.message = "";     // Limpia cualquier mensaje previo
            state.error = null;     // Limpia cualquier error previo
        },

        // Acción para manejar éxito en la solicitud
        requestSuccess: (state, action) => {
            state.loading = false;     // Establece loading en false
            state.message = action.payload;  // Guarda el mensaje de éxito
            state.error = null;        // Limpia el error
        },

        // Acción para manejar error en la solicitud
        requestFail: (state, action) => {
            state.loading = false;     // Establece loading en false
            state.message = "";        // Limpia el mensaje
            state.error = action.payload;  // Guarda el mensaje de error
        },

        // Acción para limpiar el estado
        clearStatus: (state) => {
            state.loading = false;   // Restaura el estado de loading
            state.message = "";      // Limpia el mensaje
            state.error = null;      // Limpia el error
        },
    },
});

// Exporta las acciones para ser usadas en otros lugares
export const { requestStart, requestSuccess, requestFail, clearStatus } = forgotPasswordSlice.actions;
