import User from '../Models/Users.js'

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies
    if (!token) {
      throw new Error('Token not found')
    }
    const payload = User.verifyJWT(token) //returns payload
    //see now to fetch user details we do not need to expose their id everything is in jwt token
    console.log(payload)
    const { id } = payload
    if (!id) {
      throw new Error('User not found')
    }
    req.userID = id
    next()
  } catch (err) {
    res.send(err)
    console.log(err)
  }
}

export default userAuth
