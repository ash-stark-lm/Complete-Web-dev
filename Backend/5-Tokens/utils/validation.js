import validator from 'validator'

function validUser(data) {
  if (!data.emailId) {
    throw new Error('Email is required')
  }
  if (!validator.isEmail(data.emailId)) {
    throw new Error('Email is not valid')
  }

  if (
    !data.firstName ||
    data.firstName.length < 3 ||
    data.firstName.length > 20
  ) {
    throw new Error('First name should be between 3 and 20 characters')
  }

  if (
    data.lastName &&
    (data.lastName.length < 3 || data.lastName.length > 20)
  ) {
    throw new Error('Last name should be between 3 and 20 characters')
  }

  if (!data.age || data.age < 14 || data.age > 100) {
    throw new Error('Age should be between 14 and 100')
  }

  if (!data.gender || !['male', 'female', 'other'].includes(data.gender)) {
    throw new Error('Gender should be male, female or other')
  }
  const options = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  }

  if (!validator.isStrongPassword(data.password, options)) {
    throw new Error(
      'Password should be at least 8 characters and include atleast one lowercase letter, one uppercase letter, and one symbol'
    )
  }

  if (!validator.isStrongPassword(data.password)) {
    throw new Error('Password should be strong')
  }

  return true
}

export default validUser
