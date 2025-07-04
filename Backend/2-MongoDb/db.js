import express from 'express'
import mongoose from 'mongoose'
import User from './Schema.js'
import 'dotenv/config'

const app = express()

app.use(express.json())

const url = process.env.DB_CONNECT_KEY
app.post('/user', async (req, res) => {
  try {
    await User.create(req.body, { runValidators: true })
    res.send('User created')
    console.log('User created')
  } catch (error) {
    res.send(error)
    console.log(error)
  }
})

app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    res.send(user)
  } catch (error) {
    res.send(error)
    console.log(error)
  }
})

app.get('/user', async (req, res) => {
  try {
    const users = await User.find()
    res.send(users)
  } catch (error) {
    res.send(error)
    console.log(error)
  }
})

app.patch('/user/:id', async (req, res) => {
  try {
    const { _id, ...update } = req.body
    await User.findByIdAndUpdate(_id, update, { runValidators: true })
    res.send('User updated')
    console.log('User updated')
  } catch (error) {
    res.send(error)
    console.log(error)
  }
})

async function main() {
  await mongoose.connect(url).then(async () => {
    app.listen(4000, () => {
      console.log('Server started on port 3000')
    })
  })
}
main()
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err))
