"use client"

import React from 'react'
import { ChatMessageProps } from '@/app/types/ChatMessageProps'

function ChatMessage({
  isSystemMessage,
  isOwnMessage,
  message,
  userName,
}: ChatMessageProps) {
  return (
    <div className={`flex ${isSystemMessage ? 'bg-gray-400 justify-center' : isOwnMessage ? "bg-green-500 justify-end" : "justify-start bg-blue-500"} p-4 rounded-lg mb-2 `}>
      <div className="text-white">
        {message}
      </div>
      <div className="text-xs text-gray-400 mt-1">
        {isSystemMessage ? "System" : isOwnMessage ? "You" : userName}
      </div> 
    </div>
  )
}

export default ChatMessage
