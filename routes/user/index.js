const Router = require('express-promise-router')
const router = new Router()
const {body} = require('express-validator')
const {comparePassword, generateSaltedHash} = require('../../lib/security')
const {loginRequired, formValidation} = require('../../lib/middleware')
const dbService = require('../../services/database-service')
const {NO_CONTENT_204, FORBIDDEN_403} = require('../../lib/http-codes')

const updateUserFormChecks = [
  body('display_name').isLength({min: 3}),
  body('mail').isEmail(),
]

const checkPasswordFormChecks = [
  body('old_password').isLength({min: 5}),
  body('new_password').isLength({min: 5}),
]

router.get('/', loginRequired, async function (req, res) {
  let user = await dbService.user.getById(req.user.id)
  delete user.password

  res.status(200).send(user)
})

router.put('/', loginRequired, updateUserFormChecks, formValidation, async function (req, res) {
  const displayName = req.body.display_name
  const mail = req.body.mail
  const userId = req.user.id
  await dbService.user.updateById(userId, mail, displayName)
  res.status(204).send()
})

router.post('/password', loginRequired, checkPasswordFormChecks, formValidation, async function (req, res) {
  const user = await dbService.user.getById(req.user.id, true)
  const oldPass = req.body.old_password
  const newPass = req.body.new_password
  if (await comparePassword(oldPass, user.password)) {
    const newPassHash = await generateSaltedHash(newPass)
    await dbService.user.updatePasswordById(req.user.id, newPassHash)
    res.status(NO_CONTENT_204).send()
  } else {
    return res.status(FORBIDDEN_403).send('wrong password')
  }
})

module.exports = router