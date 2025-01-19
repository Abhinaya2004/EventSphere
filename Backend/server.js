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
console.log(process.env.EMAIL)
import userRoute from './app/routes/userRoute.js'
import additionalDetailsRoute from './app/routes/additionalDetailsRoute.js'

app.use(express.json())
app.use(cors())

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  console.log(process.env.CLOUDINARY_CLOUD_NAME)

const server = http.createServer(app)
const io = new Server(server,{})

app.use('/api/users',userRoute)
app.use('/api',additionalDetailsRoute)

server.listen(port,()=>{
    console.log('server is running on port,',port)
})