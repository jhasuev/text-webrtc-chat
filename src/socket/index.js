import { io } from "socket.io-client"

const options = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
}

const url = process.env.NODE_ENV === "development" ? "http://localhost:3001" : location.origin
const socket = io(url, options)

export default socket