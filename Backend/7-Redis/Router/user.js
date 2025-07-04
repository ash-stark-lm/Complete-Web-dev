import express from 'express'
import User from '../Models/Users.js'
import userAuth from '../middleware/userAuthentication.js'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import partialValidationMiddleware from '../middleware/partialValidation.js'
const app = express()

app.use(express.json())
app.use(cookieParser())

const userRouter = express.Router()

userRouter.patch(
  '/update',
  partialValidationMiddleware,
  userAuth,
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.userID, req.body, {
        runValidators: true, //yes here are we validating but first do api level validation to save data calls
      })
      res.send(user)
      console.log('updated Successfully')
    } catch (error) {
      console.log(error)
      res.status(400).send({
        success: false,
        error: error.message || 'Something went wrong',
      })
    }
  }
)

userRouter.get('/info', userAuth, async (req, res) => {
  try {
    const users = await User.find()
    res.send(users)
  } catch (error) {
    res.send(error)
    console.log(error)
  }
})
userRouter.get('/details', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userID)
    res.send(user)
  } catch (error) {
    res.send(error)
    console.log(error)
  }
})

export default userRouter
