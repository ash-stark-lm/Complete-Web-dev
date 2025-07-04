import express from 'express'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import User from './Models/Users.js'
import validUser from './utils/validation.js'
import partialValidUser from './utils/updateValidation.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import 'dotenv/config'

const app = express()
app.use(express.json())
app.use(cookieParser())

const url = process.env.DB_CONNECT_KEY

async function Hashing(password) {
  const salt = await bcrypt.genSalt(10)
  const hashedPass = await bcrypt.hash(password, salt)
  return hashedPass
}

app.post('/register', async (req, res) => {
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
app.post('/login', async (req, res) => {
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
    const isAllowed = await bcrypt.compare(password, user.password)
    if (!isAllowed) {
      throw new Error('Invalid Credentials')
    }
    // create token

    // res.cookie('token', 'dsnifnewij932ue92')
    // Now we will use jwt
    //jwt.sign({payload},secretKey,{options})

    const token = jwt.sign(
      { id: user.id, emailId: user.emailId },
      'ashish@123',
      {
        expiresIn: 10, //valid for 10 second
      }
    )
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
app.patch('/user/', async (req, res) => {
  try {
    partialValidUser(req.body)
    const payload = jwt.verify(req.cookies.token, process.env.SECRET_KEY) //returns payload

    const user = await User.findByIdAndUpdate(payload.id, req.body, {
      runValidators: true, //yes here are we validating but first do api level validation to save data calls
    })
    res.send(user)
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      error: error.message || 'Something went wrong',
    })
  }
})

app.get('/info', async (req, res) => {
  try {
    const users = await User.find()
    res.send(users)
  } catch (error) {
    res.send(error)
    console.log(error)
  }
})
app.get('/user/', async (req, res) => {
  try {
    const payload = jwt.verify(req.cookies.token, process.env.SECRET_KEY) //returns payload
    //see now to fetch user details we do not need to expose their id everything is in jwt token
    console.log(payload)

    const user = await User.findById(payload.id)

    res.send(user)
  } catch (error) {
    res.send(error)
    console.log(error)
  }
})

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
