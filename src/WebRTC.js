import freeice from "freeice"
import socket from "@/socket/"
import ACTIONS from "@/socket/actions"

class WebRTC {
  constructor(params = {}) {
    this.makeOffer = params.makeOffer
    this.onopen = params.onopen || (() => {})
    this.onmessage = params.onmessage || (() => {})

    this.start()
  }

  // запускаем весь процесс
  start() {
    this._init()

    if (this.makeOffer) {
      this.offererAction()
    } else {
      this.answererAction()
    }
  }

  // инициализируем соединение
  _init() {
    this.peerConnection = new RTCPeerConnection({ iceServers: freeice() })
    this.peerConnection.onicecandidate = e => socket.emit(ACTIONS.RELAY_ICE, e.candidate)
  }

  // действия офферера
  async offererAction() {
    this.createChannel()

    const offer = await this.peerConnection.createOffer()
    this.peerConnection.setLocalDescription(new RTCSessionDescription(offer))

    socket.emit(ACTIONS.RELAY_SDP, offer)
    socket.on(ACTIONS.RELAY_SDP, answer => this.onGetAnswer(answer))
  }

  // создание канал передачи данных (?)
  createChannel() {
    this.dataChannel = this.peerConnection.createDataChannel("chat")
    this.initChannelEvents()
  }

  // инициализация событий
  initChannelEvents() {
    this.dataChannel.onopen = () => this._onopen()
    this.dataChannel.onmessage = e => this._onmessage(e)
  }

  // при получения ответа на оффер
  async onGetAnswer(answer) {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
    socket.on(ACTIONS.RELAY_ICE, candidate => this.onGetIceCandidate(candidate))
  }

  // действия отвечающего на оффер
  answererAction() {
    this.onDataChannel()
    socket.on(ACTIONS.RELAY_SDP, offer => this.onGetOffer(offer))
  }

  // устанавливаем обработку на открытия канала связи
  onDataChannel() {
    this.peerConnection.ondatachannel = ({ channel }) => {
      this.dataChannel = channel
      this.initChannelEvents()
    }
  }

  // при получения оффера
  async onGetOffer(offer) {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
    
    const answer = await this.peerConnection.createAnswer()
    this.peerConnection.setLocalDescription(new RTCSessionDescription(answer))

    socket.emit(ACTIONS.RELAY_SDP, answer)
    socket.on(ACTIONS.RELAY_ICE, candidate => this.onGetIceCandidate(candidate))
  }

  // при получение ice-candidate
  onGetIceCandidate(candidate) {
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  }

  // отправляет сообщение
  send(data) {
    if (typeof data != 'string') data = JSON.stringify(data)

    this.dataChannel.send(data)
  }

  // закрываем соединение
  close() {
    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection.onicecandidate = null
    }
  }
  
  // отправляем в компонент событие о том, что соединение установлено
  _onopen() {
    this.onopen()
  }
  
  // отправляем в компонент сообщение
  _onmessage({ data }) {
    this.onmessage(JSON.parse(data))
  }
}

export default WebRTC