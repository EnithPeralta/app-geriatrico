import { createSlice } from "@reduxjs/toolkit";

export const geriatricoSlice = createSlice({
    name: 'geriatrico',
    initialState: {
        isSaving: false,
        message: '',
        geriatrico: [],
        error: null,
    },
    reducers: {
        startSavingGeriatrico: (state) => {
            state.isSaving = true;
            state.message = '';
            state.error = null;
        },
        saveGeriatricoSuccess: (state, action) => {
            state.isSaving = false;
            state.message = action.payload.message;
            state.geriatrico = action.payload.geriatrico || [];
        },
        saveGeriatricoFailure: (state, action) => {
            state.isSaving = false;
            state.error = action.payload;
        },
        clearGeriatricoState: (state) => {
            state.isSaving = false;
            state.message = '';
            state.geriatrico = null;
            state.error = null;
        }
    }
});

export const { startSavingGeriatrico, saveGeriatricoSuccess, saveGeriatricoFailure, clearGeriatricoState, setGeriatricoSeleccionado } = geriatricoSlice.actions;

