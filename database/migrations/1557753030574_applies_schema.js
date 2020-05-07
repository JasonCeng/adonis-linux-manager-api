'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AppliesSchema extends Schema {
  up () {
    this.alter('applies', (table) => {
      table.date('approval_time').comment('审批时间')
      table.integer('result').defaultTo(0).comment('0:未处理，1:批准，2:拒绝')
    })
  }

  down () {
    this.drop('applies')
  }
}

module.exports = AppliesSchema
