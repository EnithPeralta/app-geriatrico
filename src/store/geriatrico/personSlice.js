import { createSlice } from '@reduxjs/toolkit';

export const personSlice = createSlice({
  name: 'person',
  initialState: {
    persona: null,
    loading: true,
    error: null,
  },
  reducers: {
    setPerson: (state, action) => {
      state.persona = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearPerson: (state) => {
      state.persona = null;
      state.loading = true;
      state.error = null;
    }
  }
});

// Exportar las acciones
export const { setPerson, setLoading, setError, clearPerson } = personSlice.actions;
