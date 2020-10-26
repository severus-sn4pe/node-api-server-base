const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const dbService = require('../services/database-service')
const {comparePassword, generateSaltedHash} = require('../lib/security')

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

passport.use('login', new LocalStrategy(
  async function (username, password, done) {
    try {
      const user = await dbService.user.getByUsername(username)
      if (!user) {
        return done(null, false, {message: 'Invalid username'})
      }
      const validLogin = await comparePassword(password, user.password)
      if (validLogin) {
        delete user.password
        return done(null, user)
      }
      return done(null, false, {message: 'Invalid password'})
    } catch (ex) {
      done(ex)
    }
  },
))

passport.use('register', new LocalStrategy(
  async function (username, password, done) {
    try {
      const user = await dbService.user.getByUsername(username)
      if (user) {
        console.log(`username ${username} already exists`)
        return done(null, false, {message: 'username already exists'})
      }
      const passwordHash = await generateSaltedHash(password)
      try {
        const userId = await dbService.user.create(username, passwordHash)
        if (userId && userId > 0) {
          return done(null, {id: userId})
        } else {
          return done(null, false, {message: 'user cloud not be created'})
        }
      } catch (ex) {
        return done(null, false, {message: 'username already exists'})
      }
    } catch (ex) {
      done(ex)
    }
  },
))


const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_KEY
opts.issuer = process.env.JWT_ISSUER

passport.use(new JwtStrategy(opts, async function (token, done) {
  try {
    return done(null, token)
  } catch (error) {
    done(error)
  }
}))

function setupAuthentication(app) {
  app.use(passport.initialize())
}

module.exports = setupAuthentication