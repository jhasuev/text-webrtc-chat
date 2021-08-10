class WebRTC {
  constructor() {
    this.peerConnection = new RTCPeerConnection()
    this.dataChannel = this.peerConnection.createDataChannel("chat")
    
    this.dataChannel.onopen = () => console.log("Channel opened!")
    this.dataChannel.onmessage = e => console.log(`Message: ${e.data}`)
    this.peerConnection.onicecandidate = () => console.log('icecandidate: ' + JSON.stringify(this.peerConnection.localDescription))
  }

  async createOffer() {
    const offer = await this.peerConnection.createOffer()
    this.peerConnection.setLocalDescription(offer)

    return Promise.resolve(offer)
  }

  async createAnswer() {
    const answer = await this.peerConnection.createAnswer()
    this.peerConnection.setLocalDescription(answer)

    return new Promise(resolve => resolve(answer))
  }

  setAnswer(answer) {
    this.peerConnection.setRemoteDescription(answer)
  }

  setOffer(offer) {
    this.peerConnection.setRemoteDescription(offer)
  }

  sendMessage(msg) {
    this.dataChannel.send(msg)
  }
}

export default WebRTC