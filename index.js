const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

let users = ['bot']

io.on('connection', (socket) => {
  socket.on('initUser', (userName) => {
    if (socket.username === userName) {
      return socket.emit('userInitialized', userName)
    }

    if (users.includes(userName)) {
      return socket.emit('nameIsBusy')
    }

    socket.username = userName
    users.push(userName)

    socket.emit('userInitialized', userName)
    io.emit('usersChanged', users)
  })

  socket.on('disconnect', () => {
    users = users.filter((item) => item !== socket.username)

    io.emit('usersChanged', users)
  })

  socket.on('newMessage', (msg) => {
    io.emit('newMessage', msg)
  })
})

http.listen(3000, () => {
  console.log('listening on *:3000')
})
