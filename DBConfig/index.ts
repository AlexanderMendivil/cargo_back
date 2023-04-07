import moment from "moment";
import { CheckListModel, CatEquipoModel } from "../models";
import { executeQuery } from "../utils/query"
import { v4 as uuidv4 } from 'uuid';

interface Vehicle{
   id: number,
   vehicleType: string,
   vehicleId: string,
   area: string,
   employee: string,
   status: boolean,
   identifier: string,
}

export const getDailyEvent = async (date: string) => {

   const checkList = await executeQuery(`select * from checklist WHERE CAST(checklist.fecha AS date) = '${date}';`) as CheckListModel[];
   const catMovilList = await executeQuery(`select  * from cat_eqmovil WHERE CAST(cat_eqmovil.fecha_alta AS date) = '${date}';`) as CatEquipoModel[];

   const unfilterVehicles: Vehicle[] = [];
   for(let i = 0; i < catMovilList.length; i++){

      if(checkList.length > 0){
         for(let j = 0; j < checkList.length; j++){
            if(catMovilList[i].equipo_movil === checkList[j]?.equipomovil && moment(catMovilList[i].fecha_alta).format('YYYY-MM-D') === moment(checkList[j]?.fecha).format('YYYY-MM-D') && catMovilList[i].area === checkList[j]?.area ){
               unfilterVehicles.push({ id: catMovilList[i].id, vehicleType: catMovilList[i].tipo_equipo, vehicleId: catMovilList[i].equipo_movil, area: checkList[j].area, employee: checkList[j].nombre, status: true, identifier: uuidv4() });
               break;
            }else{
               unfilterVehicles.push({ id: catMovilList[i].id, vehicleType: catMovilList[i].tipo_equipo, vehicleId: catMovilList[i].equipo_movil, area: catMovilList[i].area, employee: '---', status: false, identifier: uuidv4() });
            }  
         }
      }else{
         unfilterVehicles.push({ id: catMovilList[i].id, vehicleType: catMovilList[i].tipo_equipo, vehicleId: catMovilList[i].equipo_movil, area: catMovilList[i].area, employee: '---', status: false, identifier: uuidv4() });

      }
   }

   for(let i = 0; i < unfilterVehicles.length; i++){
      for(let j = 0; j < unfilterVehicles.length -1; j++){
         if(unfilterVehicles[i].id === unfilterVehicles[j].id && unfilterVehicles[i].vehicleId === unfilterVehicles[j].vehicleId && unfilterVehicles[i].vehicleType === unfilterVehicles[j].vehicleType && unfilterVehicles[i].area === unfilterVehicles[j].area && unfilterVehicles[i].status !== unfilterVehicles[j].status){
            if(unfilterVehicles[i].status){
               unfilterVehicles.splice(j,1)
            }else if(unfilterVehicles[j].status)
               unfilterVehicles.splice(i,1)
         }else if( unfilterVehicles[i].id === unfilterVehicles[j].id && unfilterVehicles[i].vehicleId === unfilterVehicles[j].vehicleId && unfilterVehicles[i].vehicleType === unfilterVehicles[j].vehicleType && unfilterVehicles[i].area === unfilterVehicles[j].area && unfilterVehicles[i].status === unfilterVehicles[j].status && unfilterVehicles[i].identifier !== unfilterVehicles[j].identifier){
            unfilterVehicles.splice(j,1)

         }
      }
   }
   return unfilterVehicles;
}

  
  
