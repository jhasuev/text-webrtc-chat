const server = require("http").createServer()
const io = require("socket.io")(server)
const ACTIONS = require("./src/socket/actions")
const Talkers = require("./classes/Talkers")

const PORT = process.env.PORT || 3001

io.on("connection", socket => {
  // поиск собеседника
  socket.on(ACTIONS.START_SEARCHING, () => {
    // если есть в ожидании собеседник
    let freeCompanionIndex = Talkers.getFreeCompanionIndex()
    if (freeCompanionIndex >= 0) {
      const talkers = Talkers.addCompanion({ freeCompanionIndex, newSocketId: socket.id })

      if (talkers) {
        // начинем общение
        talkers.forEach(talker => {
          io.to(talker.socket).emit(ACTIONS.START_DISCUSSION, talker)
        })
      }
    } else {
      // добавляем пользователя в ожидании...
      Talkers.addWaiter(socket.id)
    }

    console.log("START_SEARCHING", Talkers.getTalkers())
  })

  // обмен ключами
  socket.on(ACTIONS.RELAY_SDP, sdp => {
    if (!sdp) return null

    // console.log("ACTIONS.RELAY_SDP > sdp >", sdp);
    // найти собеседника
    const companion = Talkers.getCompanionBySocket(socket.id)
    
    // передать ему ключ
    if (companion) {
      console.log(sdp.type, " from ", socket.id, " to: ", companion.socket);
      io.to(companion.socket).emit(ACTIONS.RELAY_SDP, sdp)
    }
  })

  // обмен ice-кандидатами
  socket.on(ACTIONS.RELAY_ICE, ice => {
    // console.log(11111111111);
    // console.log(ice);
    if (!ice) return null

    const companion = Talkers.getCompanionBySocket(socket.id)
    
    if (companion) {
      console.log(" ice", ice, " from ", socket.id, " to: ", companion.socket);
      io.to(companion.socket).emit(ACTIONS.RELAY_ICE, ice)
    }
  })

  const onLeave = () => {
    const companion = Talkers.leave(socket.id)
    
    if (companion) {
      console.log("companion", companion);
      console.log(ACTIONS.STOP_DISCUSSION);
      io.to(companion.socket).emit(ACTIONS.STOP_DISCUSSION)
    }

    console.log("onLeave", Talkers.getTalkers())
  }
  socket.on("disconnecting", onLeave)
  socket.on(ACTIONS.STOP_DISCUSSION, onLeave)


  socket.on(ACTIONS.STOP_SEARCHING, () => {
    Talkers.removeWaiter(socket.id)
    socket.emit(ACTIONS.STOP_SEARCHING)

    console.log("stopping...")
    console.log(Talkers.getTalkers())
  })
})

server.listen(PORT, () => {
  console.log(`Server was started on ${PORT} port...`);
})