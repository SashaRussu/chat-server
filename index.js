// const cors = require('cors')
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

let users = ['bot']

// app.use(cors()) // can be not need

// app.get('/', (req, res) => {
//   console.log(req.query.userName)
//   res.send('Hello World!')
// })

io.on('connection', (socket) => {
  // console.log('a user connected', socket.handshake.query.userName)

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
