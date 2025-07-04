import User from '../Models/Users.js'
import redisClient from '../config/redis.js'
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies
    if (!token) {
      return res.status(401).send({
        success: false,
        message: 'You are logged out. Please login again.',
      })
    }

    const payload = User.verifyJWT(token)
    const { id } = payload
    if (!id) {
      return res.status(401).send({
        success: false,
        message: 'Invalid token. Please login again.',
      })
    }

    const isBlocked = await redisClient.exists(`token: ${token}`)
    if (isBlocked) {
      return res.status(403).send({
        success: false,
        message: 'Your session has expired. Please login again.',
      })
    }

    req.userID = id
    next()
  } catch (err) {
    console.log('Auth Error:', err)
    return res.status(403).send({
      success: false,
      message: 'Authentication failed. Please login again.',
    })
  }
}

export default userAuth
