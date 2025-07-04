const bcrypt = require('bcrypt')

const password = 'john@123'

async function Hashing() {
  console.time('Hash')
  const salt = await bcrypt.genSalt(10)
  const hashPass = await bcrypt.hash(password, salt)
  console.timeEnd('Hash')
  console.log(salt)
  console.log(hashPass)
}
Hashing()
