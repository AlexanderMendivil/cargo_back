require('dotenv').config();
import cors from "cors";
import express from 'express'
import { getDailyEvent } from '../DBConfig'
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/dailyVehicles', async (req, res) => {
  try{
    const data = await getDailyEvent(req.body.date);
    res.send(data);
  }catch(e){
    res.send({"message": "500 error"});
  }
})

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`)
})
