'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersSchema extends Schema {
  up () {
    this.alter('users', (table) => {
      table.string('pwd_bk', 60).notNullable()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UsersSchema
