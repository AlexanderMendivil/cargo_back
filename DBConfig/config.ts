import mysql from 'mysql2';

console.log(process.env.HOST)
export const config = mysql.createConnection({
    host     : process.env.HOST,
    user     : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE
  });
config.connect((error) => {
    if (error) {
      console.error('Error connecting to MySQL database: ' + error.stack);
      return;
    }
    console.log('Connected to MySQL database with connection ID ' + config.threadId);
}
)