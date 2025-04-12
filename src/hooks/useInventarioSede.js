import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers/getToken";

export const useInventarioSede = () => {
    const vincularMedicamentoInvSede = async (med_id, cantidad, med_origen) => {
        console.log(med_id, cantidad, med_origen);
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }
    
        try {
            const { data } = await geriatricoApi.post(
                `/inventariomedicamentosede/vinculoinicial/${med_id}`,
                {
                    cantidad,
                    med_origen
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            console.log("✅ Respuesta del servidor:", data);
    
            return {
                success: true,
                message: data.message || "Medicamento registrado exitosamente.",
                inventario: data.inventario || null,
                movimiento: data.movimiento || null,
            };
        } catch (error) {
            console.error("❌ Error al registrar medicamento a sede:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Error al vincular medicamento.",
            };
        }
    };
      
    const obtenerMedicamentosSede = async () => {
        const token = getToken();

        if (!token) {
            return { success: false, message: "Token de autenticación no encontrado." };
        }

        try {
            const { data } = await geriatricoApi.get("/inventariomedicamentosede", {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Respuesta del servidor:", data);

            return {
                success: true,
                message: data.message || "Medicamentos obtenidos exitosamente.",
                data: data.medicamentos || [], // Ajustado para coincidir con la respuesta del backend
            };
        } catch (error) {
            console.error("❌ Error al obtener medicamentos sede:", error);

            return {
                success: false,
                message: error.response?.data?.message || "Ocurrió un error inesperado.",
            };
        }
    };

    const entradaStockMedicamentoInvSede = async (med_sede_id, cantidad, med_origen) => {
        const token = getToken();
    
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }
    
        try {
            const response = await geriatricoApi.put(
                `/inventariomedicamentosede/entradastock/${med_sede_id}`,
                { cantidad, med_origen },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
    
            const { inventario, message } = response.data;
    
            console.log("✅ Stock actualizado correctamente:", inventario);
    
            return {
                success: true,
                message: message || "Stock del medicamento actualizado exitosamente.",
                data: inventario,
            };
        } catch (error) {
            console.error("❌ Error al agregar stock de medicamento:", error);
    
            return {
                success: false,
                message: error.response?.data?.message || "Error al actualizar el stock del medicamento.",
            };
        }
    };
    

    const salidaStockMedicamentoInvSede = async (med_sede_id, cantidad, med_destino) => {
        const token = getToken();
    
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }
    
        try {
            const response = await geriatricoApi.put(
                `/inventariomedicamentosede/salidastock/${med_sede_id}`, // 🔄 Ruta corregida
                { cantidad, med_destino },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
    
            const { inventario, message } = response.data;
    
            console.log("✅ Stock disminuido correctamente:", inventario);
    
            return {
                success: true,
                message: message || "Salida de stock registrada exitosamente.",
                data: inventario,
            };
        } catch (error) {
            console.error("❌ Error al disminuir stock de medicamento:", error);
    
            return {
                success: false,
                message: error.response?.data?.message || "Error al registrar la salida de stock.",
            };
        }
    };
    


    return {
        vincularMedicamentoInvSede,
        obtenerMedicamentosSede,
        entradaStockMedicamentoInvSede,
        salidaStockMedicamentoInvSede
    };
};