'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ApplySchema extends Schema {
  up () {
    this.create('applies', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique().comment('用户登录凭据')
      table.string('name', 80).notNullable().unique().comment('用户姓名,保留,可追溯')
      table.string('password', 60).notNullable()
      table.string('mentor', 80)
      table.timestamps()
    })
  }

  down () {
    this.drop('applies')
  }
}

module.exports = ApplySchema
