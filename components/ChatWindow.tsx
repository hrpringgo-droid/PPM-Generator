import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { sendChat } from '../services/geminiService';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scrolls the chat window to the bottom whenever messages change.
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Dependency array: scrolls when `messages` state updates

  // useCallback is used to memoize handleSendMessage, preventing its recreation on every render
  // and ensuring it has a stable identity.
  const handleSendMessage = useCallback(async () => {
    if (inputMessage.trim() === '' || isLoading) return;

    const newUserMessage: ChatMessage = { sender: 'user', text: inputMessage };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage(''); // Clear input immediately
    setIsLoading(true);

    try {
      const geminiResponse = await sendChat(inputMessage);
      const newGeminiMessage: ChatMessage = { sender: 'gemini', text: geminiResponse };
      setMessages((prev) => [...prev, newGeminiMessage]);
    } catch (error) {
      console.error('Error sending chat message:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'gemini', text: `Error: Failed to get response. ${(error as Error).message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading]); // Dependencies: inputMessage and isLoading states

  // Allows sending a message by pressing Enter key.
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 italic mt-10">
            Mulai percakapan dengan Gemini AI...
          </p>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[70%] p-3 rounded-lg bg-gray-200 text-gray-800">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span>Typing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* Scroll target */}
      </div>
      <div className="p-4 border-t border-gray-200 flex items-center">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tanyakan sesuatu pada Gemini..."
          className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || inputMessage.trim() === ''}
          className={`py-3 px-6 rounded-r-md font-semibold transition-colors duration-300
            ${isLoading || inputMessage.trim() === ''
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
          Kirim
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;