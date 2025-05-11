import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { IoSendSharp } from "react-icons/io5";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { GrClose } from "react-icons/gr";
import ChatbotImg from "../assets/chatbot.svg"

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChat = () => {
  setIsOpen((prev) => {
    const next = !prev;
    if (next && messages.length === 0) {
      setMessages([{ sender: "bot", text: "Hi, how can I help you today?" }]);
    }
    return next;
  });
};


  // Mutation for sending chat messages
  const sendMessageMutation = useMutation({
    mutationFn: async (prompt) => {
      console.log("Sending chat request with prompt:", prompt);
      const res = await axiosInstance.post("/chat", { prompt });
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Chat response received:", data);
      const botMessage = { sender: "bot", text: data.message };
      setMessages((prev) => [...prev, botMessage]);
    },
    onError: (error) => {
      console.error("Chat request error:", error);
      let errorMessage = "Something went wrong. Please try again.";
      if (error.response?.status === 404) {
        errorMessage =
          "Chat endpoint not found. Please check server configuration.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }
      setMessages((prev) => [...prev, { sender: "bot", text: errorMessage }]);
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    // Trigger mutation
    sendMessageMutation.mutate(input);
  };

  return (
    <div className="fixed bottom-10 right-4 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-gradient-to-r from-[#360072] to-[#8E00F4] text-white p-2 rounded-full shadow-lg"
        >
          <img src={ChatbotImg} alt="TechTik Logo" className="w-12 h-12 rounded-full" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 h-[500px] rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#8E00F4] to-[#360072]  text-white p-2 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img
                src={ChatbotImg} // 🔁 Replace with your image path or URL
                alt="TechTik Logo"
                className="w-10 h-10 rounded-full"
              />
              <h2 className="text-lg font-semibold">TechTik</h2>
            </div>

            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200"
            >
              <GrClose size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-blue-100 text-blue-900"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            {sendMessageMutation.isLoading && (
              <div className="mb-4 flex justify-start">
                <div className="max-w-[70%] p-3 rounded-lg bg-gray-100 text-gray-900">
                  <p>TechTik is typing...</p>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask TechTik..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#360072]"
                disabled={sendMessageMutation.isLoading}
              />
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-[#360072] to-[#8E00F4] text-white p-2 rounded-lg"
                disabled={sendMessageMutation.isLoading}
              >
                <IoSendSharp size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
