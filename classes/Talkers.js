class Talkers {
  constructor() {
    this.talkers = []
  }

  getTalkers() {
    return this.talkers
  }

  getFreeCompanionIndex() {
    return this.talkers.findIndex(discussion => discussion.length === 1)
  }

  addCompanion({ freeCompanionIndex, newSocketId }) {
    const hasInAlready = this.talkers[freeCompanionIndex].find(talker => talker.socket === newSocketId)
    if (hasInAlready) return null

    this.talkers[freeCompanionIndex].push({ socket: newSocketId, makeOffer: false })
    return this.talkers[freeCompanionIndex]
  }

  addWaiter(socket) {
    return this.talkers.push([{ socket, makeOffer: true }])
  }

  removeWaiter(socket) {
    const waiterIndex = this.getTalkerIndexBySocket(socket)
    if (waiterIndex >= 0) {
      return this.talkers.splice(waiterIndex, 1)
    }
  }

  leave(socket) {
    const talkersIndex = this.getTalkerIndexBySocket(socket)
    const talkers = this.talkers[talkersIndex]
    let companion = null

    if (talkers) {
      if (talkers.length === 2) {
        companion = talkers.find(talker => talker.socket != socket)
      }

      this.talkers.splice(talkersIndex, 1)
    }

    return companion
  }

  getTalkerIndexBySocket(socketId) {
    return this.talkers.findIndex(talkers => talkers.find(talker => talker.socket === socketId))
  }

  getCompanionBySocket(socketId) {
    const talkersIndex = this.getTalkerIndexBySocket(socketId)
    const talkers = this.talkers[talkersIndex]
    const companion = talkers && talkers.find(talker => talker.socket != socketId)

    return companion
  }
}

module.exports = new Talkers()
