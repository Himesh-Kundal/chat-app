"use client"

import React from 'react'

function ChatForm({onSendMessage}: {onSendMessage?: (message: string) => void}) {
  const [messages, setMessages] = React.useState("")
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (messages.trim() !== "") {
      if (onSendMessage) {
        onSendMessage(messages)
      } else {
        console.log("No onSendMessage handler provided")
      }
      setMessages("")
      console.log('Form submitted')
    }
  }
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <input
        type="text"
        name="message"
        onChange={(event) => setMessages(event.target.value)}
        placeholder="Type your message here..."
        className="flex-1 px-4 border-2 py-2 rounded-lg focus-outline-none"
        value={messages}
      />
      <button
        type="submit"
        className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        Send
      </button>
    </form>
  )
}

export default ChatForm
