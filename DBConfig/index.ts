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
   const catMovilList = await executeQuery(`select * from cat_eqmovil;`) as CatEquipoModel[];

   const inactiveVehicles: Vehicle[] = [];
   const activeVehicles: Vehicle[] = [];

   // Agregar los vehiculos por inactivos y activos
   for(let i = 0; i < catMovilList.length; i++){
      if(checkList.length > 0){
         for(let j = 0; j < checkList.length; j++){
            if(catMovilList[i].equipo_movil === checkList[j]?.equipomovil && catMovilList[i].area === checkList[j]?.area ){
               activeVehicles.push({ id: catMovilList[i].id, vehicleType: catMovilList[i].tipo_equipo, vehicleId: catMovilList[i].equipo_movil, area: checkList[j].area, employee: checkList[j].nombre, status: true, identifier: uuidv4() });
               break;
            }
         }
      }
   }
   const indexes: number[] = []
   for(let activeVehicle of activeVehicles){
      const indexOfActiveVehicles = catMovilList.findIndex( vehicle => vehicle.id === activeVehicle.id && vehicle.area === activeVehicle.area && vehicle.tipo_equipo === activeVehicle.vehicleType && vehicle.equipo_movil === activeVehicle.vehicleId);
      indexes.push(indexOfActiveVehicles);
   }

   for(let i = 0; i < indexes.length; i++){
      catMovilList.splice(indexes[i], 1);
   }
   for(let i = 0; i < catMovilList.length; i++){
      inactiveVehicles.push({ id: catMovilList[i].id, vehicleType: catMovilList[i].tipo_equipo, vehicleId: catMovilList[i].equipo_movil, area: catMovilList[i].area, employee: '---', status: false, identifier: uuidv4() });
   }
   return [...activeVehicles, ...inactiveVehicles];
}

  
  
