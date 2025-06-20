"use client";

import { useEffect, useState } from "react";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { ChatMessageProps } from "@/app/types/ChatMessageProps";
import { socket } from "./lib/socketClient";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [joined, setJoined] = useState<boolean>(false);
  const [room, setRoom] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const handleRoomJoin = (roomNumber: string) => {
    setRoom(roomNumber || "1");
    socket.emit("joinRoom", {
      room: roomNumber || "1",
      userName: userName || "Anonymous",
    });
    setJoined(true);
    setMessages([
      {
        isSystemMessage: true,
        isOwnMessage: false,
        message: `You have joined room ${roomNumber || "1"}`,
        userName: "System",
      },
    ]);
  };

  const handleSendMessage = (message: string) => {
    if (message.trim() === "") return;

    const chatMessage: ChatMessageProps = {
      isSystemMessage: false,
      isOwnMessage: true,
      message,
      userName: userName || "Anonymous",
    };

    socket.emit("sendMessage", {
      room,
      message,
      userName: userName || "Anonymous",
    });

    setMessages((prevMessages) => [...prevMessages, chatMessage]);
  };

  useEffect(() => {
    socket.on("message", (message: ChatMessageProps) => {
      console.log("Received message:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    return () => {
      socket.off("message");
      socket.off("connect");
      socket.off("disconnect");
    };

  }, []);

  return (
    <div className="flex w-full mt-24 justify-center">
      {!joined ? (
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="mb-4 text-2xl font-bold">Join a Room</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRoomJoin(room);
            }}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="px-4 py-2 border-2 rounded-lg focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Enter room number (default: 1)"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="px-4 py-2 border-2 rounded-lg focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Join Room
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="mb-4 text-2xl font-bold">Room:{room}</h1>
          <div className="h-[500px] overflow-y-auto p-4 mb-4 bg-gray-300 rounded-lg flex flex-col gap-2 border-2">
            {messages.map((message, index) => (
              <ChatMessage
                key={index + userName + room + message.message}
                isSystemMessage={message.isSystemMessage}
                isOwnMessage={message.isOwnMessage}
                message={message.message}
                userName={message.userName}
              />
            ))}
          </div>
          <ChatForm onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
}
