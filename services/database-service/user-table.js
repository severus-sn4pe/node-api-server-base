const DatabaseTable = require('./database-table')

class UserTable extends DatabaseTable {
  constructor() {
    super('users')
  }

  updateById(userId, mail, displayName) {
    return new Promise((resolve, reject) => {
      this.db.run(`update ${this.tableName} set mail = ?, display_name = ? where ${this.idColumn} = ?`,
        [mail, displayName, userId], function (err) {
          if (err) {
            console.log(`Error while updating user ${userId}: ${err}`)
            return reject(err)
          }
          return resolve()
        })
    })
  }

  updatePasswordById(userId, newPassword) {
    return new Promise((resolve, reject) => {
      this.db.run(`update ${this.tableName} set password = ? where ${this.idColumn} = ?`,
        [newPassword, userId], function (err) {
          if (err) {
            console.log(`Error while updating userPass ${userId}: ${err}`)
            return reject(err)
          }
          return resolve()
        })
    })
  }

  getById(itemId, includePassword = false) {
    let user = super.getById(itemId)
    if (!includePassword) delete user.password
    return user
  }

  getByUsername(username) {
    return new Promise((resolve, reject) => {
      this.db.all(`select * from ${this.tableName} where username = ?`, [username], (err, data) => {
        if (err) return reject(err)
        if (data.length === 0) return resolve(false)
        return resolve(data[0])
      })
    })
  }

  create(username, password) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `insert into ${this.tableName} (username, password) values (?,?)`, [username, password],
        function (err) {
          if (err) {
            if (err.errno === 19) {
              const msg = `username ${username} already exists`
              // TODO: should throw 409 instead of 500
              return reject(new Error(msg))
            }
            return reject(err)
          }
          console.log(`Saved new user ${this.lastID}`)
          return resolve(this.lastID)
        })
    })
  }
}

module.exports = UserTable