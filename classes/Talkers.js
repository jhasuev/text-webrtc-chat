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
    this.talkers[freeCompanionIndex].push({ socket: newSocketId })

    return this.talkers[freeCompanionIndex]
  }

  addWaiter(socket) {
    return this.talkers.push([{ socket }])
  }

  leave(socket) {
    const talkersIndex = this.talkers.findIndex(talkers => {
      return talkers.find(talker => talker.socket === socket)
    })
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
}

module.exports = new Talkers()
