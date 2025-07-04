import redisClient from '../config/redis.js'

//1. Fixed Window Rate Limiter
const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip
    const count = await redisClient.incr(ip)

    if (count === 1) {
      await redisClient.expire(ip, 60) //10 req|min
    }

    if (count > 10) {
      throw new Error('Too Many Requests')
    }

    next()
  } catch (error) {
    console.error('Rate Limiter Error:', error)
    res.send(error.message || 'Rate limit exceeded')
  }
}

export default rateLimiter
