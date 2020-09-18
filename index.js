const cors = require('cors')
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

let users = []

app.use(cors()) // can be not need

// app.get('/', (req, res) => {
//   console.log(req.query.userName)
//   res.send('Hello World!')
// })

io.on('connection', (socket) => {
  // console.log('a user connected', socket.handshake.query.userName)

  socket.on('initUser', (userName) => {
    if (socket.userName === userName) {
      return socket.emit('userInitialized', userName)
    }

    if (users.includes(userName)) {
      return socket.emit('nameIsBusy')
    }

    socket.userName = userName
    users.push(userName)

    socket.emit('userInitialized', userName)
  })

  socket.on('disconnect', () => {
    users = users.filter((item) => item !== socket.userName)
  })

  socket.on('newMessage', (msg) => {console.log(msg)
    io.emit('newMessage', msg)
  })
})

http.listen(3000, () => {
  console.log('listening on *:3000')
})
