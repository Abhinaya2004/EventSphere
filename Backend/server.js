import express from 'express'

import { config } from 'dotenv'
config()
import ConfigDb from './config/DB.js'
ConfigDb()
import cloudinary from 'cloudinary'

import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const port =  process.env.PORT

import userRoute from './app/routes/userRoute.js'
import additionalDetailsRoute from './app/routes/additionalDetailsRoute.js'
import venueRoute from './app/routes/venueRoute.js'
import adminRoute from './app/routes/adminRoute.js'
import eventRoute from './app/routes/eventRoute.js'
import paymentRoute from './app/routes/paymentRoute.js'


app.use(express.json())
app.use(express.urlencoded({ extended: true })); 
app.use(cors())

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

 

const server = http.createServer(app)
const io = new Server(server,{})

app.use('/api/users',userRoute)
app.use('/api',additionalDetailsRoute)
app.use('/api/venues',venueRoute)
app.use('/api/events',eventRoute)
app.use("/api/admin", adminRoute)
app.use('/api',paymentRoute)

server.listen(port,()=>{
    console.log('server is running on port,',port)
})