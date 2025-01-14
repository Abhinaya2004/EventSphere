import express from 'express'

import { config } from 'dotenv'
config()
import ConfigDb from './config/DB.js'
ConfigDb()

import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const port =  process.env.PORT

import userRoute from './app/routes/userRoute.js'

app.use(express.json())
app.use(cors())

const server = http.createServer(app)
const io = new Server(server,{})

app.use('/api/users',userRoute)

server.listen(port,()=>{
    console.log('server is running on port,',port)
})