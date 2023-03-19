import { VehicleInterface } from "../models/VehicleModel";
import { executeQuery } from "../utils/query"

export const getDailyEvent = async (date: string) => {
   return await executeQuery(`select cat_eqmovil.tipo_equipo, cat_eqmovil.estado_equipo, checklist.* 
   FROM cat_eqmovil JOIN checklist ON cat_eqmovil.equipo_movil = checklist.equipomovil
   WHERE CAST(checklist.fecha AS date) = '${date}';`) as VehicleInterface[];
   
}

  
  
