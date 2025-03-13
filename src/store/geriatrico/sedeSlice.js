import { createSlice } from '@reduxjs/toolkit';

export const sedeSlice = createSlice({
    name: 'sede',
    initialState: {
        sedes: [],
        error: null,
        loading: false,
        message: ''
    },
    reducers: {
        startSede: (state) => {
            state.loading = true;
            state.error = null;
            state.message = '';
        },
        setSede: (state, action) => {
            state.sedes = action.payload;
            state.loading = false;
            state.error = null;
            state.message = 'Sedes cargadas correctamente';
        },
        setUsuario: (state, action) => {
            state.sedes = action.payload;
            state.loading = false;
            state.error = null;
            state.message = 'Usuarios cargados correctamente';
        },
        setSedeRol: (state, action) => {
            state.sedes = action.payload;
            state.loading = false;
            state.error = null;
            state.message = 'Roles cargados correctamente';
        },
            
        setSedeError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.message = 'Error al obtener las sedes';
        },
        addSede: (state, action) => {
            state.sedes.push(action.payload);
            state.message = 'Sede agregada correctamente';
        },
        removeSede: (state, action) => {
            state.sedes = state.sedes.filter(sede => sede.id !== action.payload);
            state.message = 'Sede eliminada correctamente';
        }
    }
});

// Exportar las acciones correctamente
export const { startSede, setSede, setSedeError, addSede, removeSede, setUsuario, setSedeRol } = sedeSlice.actions;

