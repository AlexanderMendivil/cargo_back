require('dotenv').config();
import express from 'express'
import { getData } from '../DBConfig'
const app = express();
const port = process.env.PORT;

app.get('/', async (req, res) => {
  const data = await getData();
  res.send(data);
})

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`)
})
