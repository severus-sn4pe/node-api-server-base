const Router = require('express-promise-router')
const router = new Router()
const passport = require('passport')
const {generateJWT} = require('../../lib/security')
const {OK_200, CREATED_201} = require('../../lib/http-codes')
const {loginRequired, registerMiddleware, loginNotRequired} = require('../../lib/middleware')
const dbService = require('../../services/database-service')


router.get('/', loginNotRequired, async function (req, res) {
  const resultObj = {message: `hello, this is dog`, logged_in: req.isAuthenticated()}
  if (req.isAuthenticated()) resultObj.user_id = req.user.id
  res.status(OK_200).send(resultObj)
})

router.get('/list', loginRequired, async function (req, res) {
  const userCount = await dbService.user.getItemCount()
  res.status(OK_200).send({users: userCount})
})

router.post('/register', registerMiddleware, async function (req, res) {
  return res.status(CREATED_201).send({success: true, user: req.user.id})
})

router.post('/renew_login', loginRequired, async function (req, res) {
  const payload = {id: req.user.id}
  const token = await generateJWT(payload)
  return res.status(OK_200).json({token})
})

router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user) => {
      try {
        if (err || !user) {
          return next(new Error('An error occurred.'))
        }
        req.login(user, {session: false},
          async (error) => {
            if (error) return next(error)
            const payload = {id: user.id}
            const token = await generateJWT(payload)
            return res.json({token})
          },
        )
      } catch (error) {
        return next(error)
      }
    },
  )(req, res, next)
})

module.exports = router