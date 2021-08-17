import freeice from "freeice"

class WebRTC {
  constructor() {
    this.peerConnection = new RTCPeerConnection({ iceServers: freeice() })
    this.peerConnection.onicecandidate = (e) => {
      if (e.candidate) {
        this.icecandidate = e.candidate
      }
    }
  }
  
  getIceCandidate() {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (this.icecandidate) {
          clearInterval(interval)
          resolve(this.icecandidate)
        }
      }, 100);
    })
  }

  async createOffer() {
    this.dataChannel = this.peerConnection.createDataChannel("chat")
    this.dataChannel.onopen = () => alert("Channel opened!")
    this.dataChannel.onmessage = e => console.log(`Message: ${e.data}`)

    const offer = await this.peerConnection.createOffer()
    this.peerConnection.setLocalDescription(offer)

    return Promise.resolve(offer)
  }

  async createAnswer() {
    const answer = await this.peerConnection.createAnswer()
    this.peerConnection.setLocalDescription(answer)

    this.peerConnection.ondatachannel = event => {
      alert("ondatachannel");
      this.dataChannel = event.channel
      this.dataChannel.onopen = () => alert("Channel opened!")
      this.dataChannel.onmessage = e => console.log(`Message: ${e.data}`)
    }

    return Promise.resolve(answer)
  }

  async setRemoteSdp(sdp) {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))
    return Promise.resolve()
  }

  sendMessage(msg) {
    this.dataChannel.send(msg)
  }
}

export default WebRTC