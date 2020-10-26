const userRouter = require('../routes/user')
const authRouter = require('../routes/authentication')

module.exports = function (app) {
  app.use(`/`, authRouter)
  app.use(`/user`, userRouter)
}