'use strict'

const Message = use('App/Models/Message')
const Database = use('Database')

class MessageController {
  async createMessage ({ request, auth, response }) {
    console.log(request)
    try{
      // const messageData = request.only(['content', 'author'])
      const author = request.input('author')
      const content = request.input('content')
      const message = await Message.create({
        author: author,
        content: content
      })
      return response.json({
        status: 'success',
        data: message
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: error
      })
    }
  }

  async showMessage({ request, auth, response}) {
    const data = await Database.table('messages').select()
    return response.json({
      status: 'success',
      data: data
    })
  }
}

module.exports = MessageController
