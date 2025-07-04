import redisClient from '../config/redis.js'
import crypto from 'crypto'

const windowSize = 3600 // 60 min
const maxRequest = 5

const slidingRateLimiter = async (req, res, next) => {
  try {
    const key = `IP:${req.ip}`
    const current_time = Date.now() / 1000
    const window_time = current_time - windowSize

    // 1. Remove old entries
    await redisClient.zRemRangeByScore(key, 0, window_time)

    // 2. Count current requests
    const numberOfRequest = await redisClient.zCard(key)

    if (numberOfRequest >= maxRequest) {
      throw new Error(`429 Too Many Requests — IP: ${req.ip}`)
    }

    // 3. Add current request to sorted set
    const value = `${current_time}:${crypto.randomUUID()}`
    await redisClient.zAdd(key, [{ score: current_time, value }])

    // 4. Optional: TTL cleanup
    await redisClient.expire(key, windowSize)

    next()
  } catch (error) {
    console.log('Rate Limiter Error:', error)
    return res.status(429).send({
      success: false,
      error: error.message || 'Rate limit exceeded',
    })
  }
}

export default slidingRateLimiter
