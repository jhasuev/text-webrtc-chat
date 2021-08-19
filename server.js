const PORT = process.env.PORT || 3001
const express = require("express")
const socket = require("socket.io")
const ACTIONS = require("./src/socket/actions")
const Talkers = require("./classes/Talkers")

const app = express()
const io = socket(app.listen(PORT))
app.use(express.static(__dirname + "/dist"))

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

  const sendItToCompanion = (action, data) => {
    if (!data) return null
    
    const companion = Talkers.getCompanionBySocket(socket.id)
    if (companion) {
      io.to(companion.socket).emit(action, data)
    }
  }

  // обмен ключами
  socket.on(ACTIONS.RELAY_SDP, data => sendItToCompanion(ACTIONS.RELAY_SDP, data))

  // обмен ice-кандидатами
  socket.on(ACTIONS.RELAY_ICE, data => sendItToCompanion(ACTIONS.RELAY_ICE, data))

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

  socket.on(ACTIONS.RELAY_TOTAL, () => {
    const total = Talkers.getTalkers().reduce((acc, talkers) => acc + talkers.length, 0)
    socket.emit(ACTIONS.RELAY_TOTAL, total)
  })
})
