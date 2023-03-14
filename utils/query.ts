import { config } from "../DBConfig/config";

export const executeQuery = (sql: string) => {
    return new Promise((resolve, reject) => {
      config.query( sql, (error, results, fields ) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }