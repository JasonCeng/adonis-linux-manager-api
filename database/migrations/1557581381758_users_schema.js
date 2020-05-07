'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersSchema extends Schema {
  up () {
    this.alter('users', (table) => {
      table.boolean('appliedflag').defaultTo(false).comment('false:未申请,true:已申请')
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UsersSchema
