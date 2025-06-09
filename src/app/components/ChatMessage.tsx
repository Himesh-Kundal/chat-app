"use client"

import React from 'react'
import { ChatMessageProps } from '@/app/types/ChatMessageProps'

function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours}:${minutes} ${ampm}`;
}

function ChatMessage({
  isSystemMessage,
  isOwnMessage,
  message,
  userName,
}: ChatMessageProps) {
  let alignment = "self-start";
  let bg = "bg-green-500";
  if (isSystemMessage) {
    alignment = "self-center";
    bg = "bg-gray-900";
  } else if (isOwnMessage) {
    alignment = "self-end";
    bg = "bg-blue-500";
  }

  return (
    <div
      className={`flex flex-col ${alignment} ${bg} max-w-[70%] px-4 py-2 rounded-lg mb-2`}
    >
      <div className="text-white break-words">{message}</div>
      <div className="text-xs text-gray-200 mt-1">
        {isSystemMessage ? "System" : isOwnMessage ? "You" : userName} {getCurrentTime()}
      </div>
    </div>
  )
}

export default ChatMessage