import express from 'express'
import mongoose from 'mongoose'

import cookieParser from 'cookie-parser'
import 'dotenv/config'
import authRouter from './Router/auth.js'
import userRouter from './Router/user.js'
import redisClient from './config/redis.js'
import rateLimiter from './middleware/rateLimiter.js'
import slidingRateLimiter from './middleware/slidingWindowRateLimiter.js'

const app = express()
const url = process.env.DB_CONNECT_KEY
app.use(express.json())
app.use(cookieParser())

//app.use(rateLimiter)
app.use(slidingRateLimiter)

app.use('/auth', authRouter)
app.use('/user', userRouter)

async function main() {
  await mongoose.connect(url)
}

const InitializeConection = async () => {
  try {
    /*await redisClient.connect()
    console.log('Connected to redis')

    await main()
    console.log('connected to mongoDB')
    */
    //Try to do in parallel for connection little bit faster
    await Promise.all([redisClient.connect(), main()])
    console.log('Connected to redis and mongoDB')

    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT || 4000}`)
    })
  } catch (error) {
    console.log('error' + error)
  }
}
InitializeConection()
