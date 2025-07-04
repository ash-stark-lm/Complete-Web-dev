import partialValidUser from '../utils/updateValidation.js'
const partialValidationMiddleware = (req, res, next) => {
  try {
    partialValidUser(req.body)
    next()
  } catch (err) {
    res.status(400).send({
      success: false,
      error: err.message || 'Validation failed',
    })
  }
}

export default partialValidationMiddleware
