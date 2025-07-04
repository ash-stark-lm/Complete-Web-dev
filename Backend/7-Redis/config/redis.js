import { createClient } from 'redis'
import 'dotenv/config'

const redisClient = createClient({
  username: 'default',
  password: process.env.REDIS_CONNECT_PASSWORD,
  socket: {
    host: 'redis-18542.c244.us-east-1-2.ec2.redns.redis-cloud.com',
    port: 18542,
  },
})

export default redisClient
