import { useEffect, useMemo, useState } from 'react';

// Este hook se utiliza para gestionar formularios y validaciones en React.
export const useForm = (initialForm = {}, formValidations = {}) => {

    // Estado que almacena los valores del formulario.
    const [formState, setFormState] = useState(initialForm);

    // Estado que almacena los resultados de las validaciones del formulario.
    const [formValidation, setFormValidation] = useState({});

    // useEffect que se ejecuta cada vez que cambia el estado del formulario.
    // Se encarga de ejecutar las validaciones y actualizar el estado `formValidation`.
    useEffect(() => {
        createValidators();
    }, [formState]);

    // useEffect que se ejecuta cuando cambia el formulario inicial (`initialForm`).
    // Esto asegura que el formulario se actualice si el valor inicial cambia.
    useEffect(() => {
        setFormState(initialForm);
    }, [initialForm]);

    // Memoización para determinar si todo el formulario es válido.
    // Si alguna validación en `formValidation` tiene un error, el formulario no será válido.
    const isFormValid = useMemo(() => {
        for (const formValue of Object.keys(formValidation)) {
            if (formValidation[formValue] !== null) return false; // Si hay un error, retorna false.
        }
        return true; // Si no hay errores, el formulario es válido.
    }, [formValidation]);

    // Función para manejar cambios en los campos del formulario.
    // Actualiza el valor del campo correspondiente en el estado `formState`.
    const onInputChange = ({ target }) => {
        const { name, type, value, files } = target;
    
        setFormState((prevState) => ({
            ...prevState,
            [name]: type === "file" ? files[0] : name === "rol_id" ? Number(value) : value
        }));
    };
    
    
    // Función para reiniciar el formulario a su estado inicial.
    const onResetForm = () => {
        setFormState(initialForm);
    };

    // Función para validar los campos del formulario según las reglas definidas en `formValidations`.
    const createValidators = () => {
        const formCheckedValues = {}; // Objeto para almacenar las validaciones de cada campo.

        // Itera sobre cada campo en `formValidations`.
        for (const formField of Object.keys(formValidations)) {
            const [fn, errorMessage] = formValidations[formField]; // Obtiene la función de validación y el mensaje de error.

            // Aplica la función de validación y guarda el resultado:
            // - `null` si es válido.
            // - Mensaje de error si no es válido.
            formCheckedValues[`${formField}Valid`] = fn(formState[formField]) ? null : errorMessage;
        }

        // Actualiza el estado `formValidation` con los resultados de las validaciones.
        setFormValidation(formCheckedValues);
    };

    // Estado para manejar la visibilidad de la contraseña
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Función para alternar la visibilidad de la contraseña
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    // Retorna los valores y funciones necesarios para usar el formulario.
    return {
        ...formState,         // Desestructura los valores del formulario.
        formState,            // Retorna el estado completo del formulario.
        onInputChange,        // Función para manejar cambios en los inputs.
        onResetForm,          // Función para reiniciar el formulario.
        ...formValidation,    // Desestructura las validaciones de los campos.
        isFormValid,          // Booleano que indica si el formulario es válido.
        isPasswordVisible,    // Estado de visibilidad de la contraseña.
        togglePasswordVisibility, // Función para alternar la visibilidad de la contraseña.
    };
};
