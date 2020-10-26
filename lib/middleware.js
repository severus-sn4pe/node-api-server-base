const passport = require('passport')
const {verifyJWT} = require('./security')
const {validationResult} = require('express-validator')

module.exports = {
  loginRequired: passport.authenticate('jwt', {session: false}),
  registerMiddleware: passport.authenticate('register', {session: false}),
  loginNotRequired: async (req, res, next) => {
    const auth = req.header('authorization')
    if (auth && auth.substring(0, 6).toLowerCase() === 'bearer') {
      const token = auth.substring(7)
      try {
        const payload = await verifyJWT(token)
        req.user = payload
      } catch {
      }
    }
    next()
  },
  formValidation: (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()})
    }
    next()
  },
}