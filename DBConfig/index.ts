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

   const inactiveVehicles: Vehicle[] = [];
   const activeVehicles: Vehicle[] = [];
   for(let i = 0; i < catMovilList.length; i++){

      if(checkList.length > 0){
         for(let j = 0; j < checkList.length; j++){
            if(catMovilList[i].equipo_movil === checkList[j]?.equipomovil && moment(catMovilList[i].fecha_alta).format('YYYY-MM-D') === moment(checkList[j]?.fecha).format('YYYY-MM-D') && catMovilList[i].area === checkList[j]?.area ){
               activeVehicles.push({ id: catMovilList[i].id, vehicleType: catMovilList[i].tipo_equipo, vehicleId: catMovilList[i].equipo_movil, area: checkList[j].area, employee: checkList[j].nombre, status: true, identifier: uuidv4() });
               break;
            }else{
               if(activeVehicles.some(vehicle => vehicle.vehicleId !== catMovilList[i].equipo_movil))
                  inactiveVehicles.push({ id: catMovilList[i].id, vehicleType: catMovilList[i].tipo_equipo, vehicleId: catMovilList[i].equipo_movil, area: catMovilList[i].area, employee: '---', status: false, identifier: uuidv4() });
            }  
         }
      }else{
         inactiveVehicles.push({ id: catMovilList[i].id, vehicleType: catMovilList[i].tipo_equipo, vehicleId: catMovilList[i].equipo_movil, area: catMovilList[i].area, employee: '---', status: false, identifier: uuidv4() });

      }
   }

   const duplicatedVehicles: Vehicle[] = [];
   for(let i = 0; i <= inactiveVehicles.length-1; i++){
      for(let j = 0; j < activeVehicles.length; j++){
         if(inactiveVehicles[i].id === activeVehicles[j].id && inactiveVehicles[i].vehicleId === activeVehicles[j].vehicleId && inactiveVehicles[i].vehicleType === activeVehicles[j].vehicleType && inactiveVehicles[i].area === activeVehicles[j].area){
            duplicatedVehicles.push(inactiveVehicles[i]);
         }
      }
   }

   const filteredDuplicatedVehicles = inactiveVehicles.filter(vehicle => !duplicatedVehicles.includes(vehicle));

   const cleanedInactiveVehicles: Vehicle[] = [];
   for(let i = 0; i < filteredDuplicatedVehicles.length; i++){
      for(let j = 0; j < filteredDuplicatedVehicles.length -1; j++){
         if( filteredDuplicatedVehicles[i].id === filteredDuplicatedVehicles[j].id && filteredDuplicatedVehicles[i].vehicleId === filteredDuplicatedVehicles[j].vehicleId && filteredDuplicatedVehicles[i].vehicleType === filteredDuplicatedVehicles[j].vehicleType && filteredDuplicatedVehicles[i].area === filteredDuplicatedVehicles[j].area && filteredDuplicatedVehicles[i].status === filteredDuplicatedVehicles[j].status && filteredDuplicatedVehicles[i].identifier !== filteredDuplicatedVehicles[j].identifier){
            if(cleanedInactiveVehicles.some(vehicle => vehicle.vehicleType === filteredDuplicatedVehicles[j].vehicleType)){
               break;   
            }
            cleanedInactiveVehicles.push(filteredDuplicatedVehicles[j]);
            break;

         }
      }
   }
   return [...activeVehicles, ...cleanedInactiveVehicles];
}

  
  
