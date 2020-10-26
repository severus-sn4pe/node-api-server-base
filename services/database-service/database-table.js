const Database = require('./database')

class DatabaseTable extends Database {
  constructor(name, idColumn = 'id') {
    super()
    this.tableName = name
    this.idColumn = idColumn
  }

  getAll() {
    return new Promise((resolve, reject) => {
      this.db.all(`select * from ${this.tableName} order by rowid desc`, [], (err, data) => {
        if (err) return reject(err)
        return resolve(data)
      })
    })
  }

  getItemCount() {
    return new Promise((resolve) => {
      this.db.all(`select count(*) as count from ${this.tableName}`, [], function (err, data) {
        if (data && data.length >= 1) {
          return resolve(data[0].count)
        }
        return resolve(0)
      })
    })
  }

  getById(itemId) {
    return new Promise((resolve, reject) => {
      this.db.all(`select * from ${this.tableName} where ${this.idColumn} = ?`, [itemId], (err, data) => {
        if (err) return reject(err)
        if (data.length === 0) return resolve(false)
        return resolve(data[0])
      })
    })
  }

  deleteAll() {
    return new Promise((resolve, reject) => {
      this.db.all(`DELETE from ${this.tableName}`, [], (err) => {
        if (err) return reject(err)
        return resolve(true)
      })
    })
  }

  deleteById(itemId) {
    return new Promise((resolve, reject) => {
      this.db.run(`delete from ${this.tableName} where ${this.idColumn} = ?;`, [itemId],
        function (err) {
          if (err) {
            console.log(`Error while deleting ${this.tableName}: ${err}`)
            return reject(err)
          }
          console.log(`Deleted ${this.tableName} with id ${itemId}`)
          return resolve()
        })
    })
  }
}

module.exports = DatabaseTable