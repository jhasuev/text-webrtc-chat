export const getMessageId = () => (Date.now() + +String(Math.random()).split(".").pop()).toString(16)

export const createMessage = text => ({
  text,
  id: getMessageId(),
  type: "message",
  time: Date.now(),
  sent: false,
})
