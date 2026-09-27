import { useState } from 'react';
import axios from 'axios';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi! Ask me about today's specials, healthy options, or your order." }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await axios.post('http://localhost:5000/api/chat/message', {
        message: input
      });
      setMessages((prev) => [...prev, { sender: 'bot', text: res.data.response }]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 px-5 py-3 rounded-full bg-white text-black font-semibold text-sm shadow-lg hover:scale-105 active:scale-95 transition-transform"
      >
        💬 Chat
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 w-80 h-[420px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
        <span className="text-white font-semibold text-sm">Canteen Assistant</span>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
            <span
              className={`inline-block px-3 py-2 rounded-xl text-sm max-w-[80%] ${
                msg.sender === 'user'
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white'
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex border-t border-white/10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatWidget;