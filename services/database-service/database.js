const sqlite3 = require('sqlite3')

class Database {
  constructor() {
    this.db = undefined
    this.initDB()
  }

  initDB() {
    if (!this.db) {
      let database_filename = 'data/database.db'
      const debug_db = process.env.DEBUG_DATABASE
      if (debug_db !== undefined && debug_db !== '') database_filename = `data/${debug_db}`
      this.db = new sqlite3.Database(database_filename)
    }
    if (!this.db) console.log('ERROR: DATABASE is not correctly initialized')
  }

  get DB() {
    return this.db
  }
}

module.exports = Database