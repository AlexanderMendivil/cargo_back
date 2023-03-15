import { executeQuery } from "../utils/query"

export const getDailyEvent = async (date: string) => {
   return await executeQuery(`SELECT * FROM checklist WHERE CAST(fecha AS date) = '${date}'`);
}

  
  
