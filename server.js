import express from 'express'
import cors from 'cors'
import Connection  from './config/db.js'
import foodRouter  from './routes/foodRoute.js'
import userRouter from './routes/userRoute.js'
import cartRouter from './routes/cartRouter.js'
import 'dotenv/config'
import orderRouter from './routes/orderRouter.js'

//app config
const app = express()
const port = 3000

//middleware
app.use(express.json())
app.use(cors())

//database connection
Connection()

//api endpoints
app.use('/api/food', foodRouter)
app.use("/images", express.static('uploads'))
app.use('/api/user', userRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)


app.get('/', (req, res) => {
    res.send("get the data")
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})

// mongodb+srv://mrthakursm:Mongodb%40123@cluster0.wv68kwj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//URL-code for Special character is different like '@' -> '%40'