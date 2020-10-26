const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
  generateSaltedHash: async (password, saltRounds = 10) => {
    return await bcrypt.hash(password, saltRounds)
  },

  comparePassword: async (password, saltedHash) => {
    return await bcrypt.compare(password, saltedHash)
  },

  generateJWT: async (payload) => {
    return new Promise((resolve, reject) => {
      payload.iat = parseInt(Date.now() / 1000 + "")
      if (process.env.JWT_ISSUER) payload.iss = process.env.JWT_ISSUER
      jwt.sign(payload, process.env.JWT_KEY, {algorithm: 'HS256', expiresIn: '1 hour'}, (err, token) => {
        if (err) {
          console.log(`Failed to generate jwt: ${err}`)
          return reject()
        }
        resolve(token)
      })
    })
  },

  verifyJWT: (token) => {
    return new Promise((resolve) => {
      jwt.verify(token, process.env.JWT_KEY, {algorithm: 'HS256', issuer: process.env.JWT_ISSUER}, (err, payload) => {
        if (err) resolve(undefined)
        resolve(payload)
      })
    })
  },
}