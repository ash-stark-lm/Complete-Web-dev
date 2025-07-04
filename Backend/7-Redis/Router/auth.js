//register login and logout
import express from 'express'
import bcrypt from 'bcrypt'
import User from '../Models/Users.js'
import validUser from '../utils/validation.js'
import partialValidUser from '../utils/updateValidation.js'

import cookieParser from 'cookie-parser'
import redisClient from '../config/redis.js'
import userAuth from '../middleware/userAuthentication.js'
import jwt from 'jsonwebtoken'

const app = express()
app.use(express.json())
app.use(cookieParser())

async function Hashing(password) {
  const salt = await bcrypt.genSalt(10)
  const hashedPass = await bcrypt.hash(password, salt)
  return hashedPass
}

const authRouter = express.Router()
authRouter.post('/register', async (req, res) => {
  try {
    validUser(req.body)
    let userPass = req.body.password
    userPass = await Hashing(userPass)
    await User.create({ ...req.body, password: userPass })
    res.send('User created')
    console.log('User created')
  } catch (err) {
    console.log(err)
    res.status(400).send({
      success: false,
      error: err.message || 'Something went wrong',
    })
  }
})
//login
authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body
    //validate
    partialValidUser(req.body)
    const user = await User.findOne({ emailId: emailId })
    if (!user) {
      throw new Error('User not found')
    }
    if (user.emailId !== emailId) {
      throw new Error('Invalid Credentials')
    }
    //for password
    const isAllowed = user.verifyPassword(password)
    if (!isAllowed) {
      throw new Error('Invalid Credentials')
    }
    // create token

    // res.cookie('token', 'dsnifnewij932ue92')
    // Now we will use jwt
    //jwt.sign({payload},secretKey,{options})

    const token = user.getJWT() //userSchema Methods
    res.cookie('token', token)
    res.send('Login Successfully')
    console.log('Login Successfully')
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      error: error.message || 'Something went wrong',
    })
  }
})

//redis ke database mai jo bhi blocked token hai use dalna hai
//key value pair-> unique key
//key:-> token:"klndk23lns",value:"blocked"
//iat->time when token is created in second from 1 jan 1970
//exp->time when token expires in second from 1 jan 1970
// iat: 1751605547,
// exp: 1751691947
authRouter.post('/logout', userAuth, async (req, res) => {
  //first validate token authenticate user
  const { token } = req.cookies
  const payload = jwt.decode(token)

  await redisClient.set(`token: ${token}`, 'blocked')
  //await redisClient.expire(`token: ${token}`) //after 30 min token gets deleted from db
  await redisClient.expireAt(`token: ${token}`, payload.exp)
  res.send('Logged Out Successfully')
  console.log('Logout Successfully')
})
export default authRouter
