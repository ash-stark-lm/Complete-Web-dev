import express from 'express'
import mongoose from 'mongoose'

import cookieParser from 'cookie-parser'
import 'dotenv/config'
import authRouter from './Router/auth.js'
import userRouter from './Router/user.js'

const app = express()
app.use(express.json())
app.use(cookieParser())

const url = process.env.DB_CONNECT_KEY

app.use('/auth', authRouter)
app.use('/user', userRouter)

async function main() {
  await mongoose.connect(url).then(() => {
    app.listen(4000, () => {
      console.log('Server started on port 4000')
    })
  })
}
main()
  .then(() => console.log('Connection to MongoDB successful'))
  .catch((err) => console.log(err))
