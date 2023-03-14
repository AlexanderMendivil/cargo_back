import { executeQuery } from "../utils/query"

export const getData = async () => {
   return await executeQuery('SELECT * FROM cat_cilindros');
}

  
  
