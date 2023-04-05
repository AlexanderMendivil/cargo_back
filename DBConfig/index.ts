import moment from "moment";
import { CheckListModel, CatEquipoModel } from "../models";
import { executeQuery } from "../utils/query"

export const getDailyEvent = async (date: string) => {

   const checkList = await executeQuery(`select * from checklist WHERE CAST(checklist.fecha AS date) = '${date}';`) as CheckListModel[];
   const catMovilList = await executeQuery(`select  * from cat_eqmovil WHERE CAST(cat_eqmovil.fecha_alta AS date) = '${date}';`) as CatEquipoModel[];

   const vehicles: any[] = [];
   for(let i = 0; i < catMovilList.length; i++){
      if(catMovilList[i].equipo_movil === checkList[i].equipomovil && moment(catMovilList[i].fecha_alta).format('YYYY-MM-D') === moment(checkList[i].fecha).format('YYYY-MM-D') ){
         vehicles.push({ id: catMovilList[i].id, vehicleType: catMovilList[i].tipo_equipo, vehicleId: catMovilList[i].equipo_movil, area: checkList[i].area, employee: checkList[i].nombre, status: true });
      }else{
         vehicles.push({ id: catMovilList[i].id, vehicleType: catMovilList[i].tipo_equipo, vehicleId: catMovilList[i].equipo_movil, area: catMovilList[i].area, employee: '---', status: false });

      }
   }

   return vehicles;
}

  
  
