import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 20,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 14,
      max: 100,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    password: {
      type: String,
      minLength: 8,
      required: true,
      maxlength: 70,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.getJWT = function () {
  const ans = jwt.sign(
    { id: this.id, emailId: this.emailId },
    process.env.SECRET_KEY,
    {
      expiresIn: '30m', //valid for 10 second
    }
  )
  return ans
}

userSchema.methods.verifyPassword = async function (password) {
  const ans = await bcrypt.compare(password, this.password)
  return ans
}
//Static function
userSchema.statics.verifyJWT = function (token) {
  return jwt.verify(token, process.env.SECRET_KEY)
}

const User = mongoose.model('User', userSchema)
export default User
