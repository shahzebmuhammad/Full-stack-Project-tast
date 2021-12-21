import express from 'express';
import dotenv from 'dotenv'
import router from './router'
import cors from 'cors'
import cache from 'memory-cache'


const app = express();
app.use(cors({
    origin: '*'
}));


app.use(express.json())


dotenv.config()
const port = process.env.PORT
const env = process.env


cache.put('balance', env.balance);


app.use('/api/v1', router)

app.listen(port, () => console.log(`running on ${port}`))