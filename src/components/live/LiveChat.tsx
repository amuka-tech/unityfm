'use client';

import React, { useState } from 'react';
import { Send, MessageSquare, Heart, ThumbsUp, Sparkles, User, ShieldCheck } from 'lucide-react';

interface ChatMessage {
  id: number;
  user: string;
  location: string;
  text: string;
  time: string;
  isVerified?: boolean;
}

const initialMessages: ChatMessage[] = [
  { id: 1, user: 'Dr. Odongo Tom', location: 'Lira City East', text: 'Clear visuals on the Lira-Kamdini road coverage! Great work Unity TV.', time: '20:12', isVerified: true },
  { id: 2, user: 'Auma Beatrice', location: 'Dokolo Town', text: 'Please ask the MAAIF representative about subsidized soya seeds for the second planting season.', time: '20:14' },
  { id: 3, user: 'Opio Denis', location: 'Gulu City', text: 'Watching live from Gulu. Best TV station in Northern Uganda!', time: '20:15' },
  { id: 4, user: 'Akello Sharon', location: 'Apac District', text: 'Kudos on the Shea butter special documentary earlier. Our Otuke women cooperatives are watching.', time: '20:18' },
];

export function LiveChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [userName, setUserName] = useState('');
  const [location, setLocation] = useState('');
  const [likes, setLikes] = useState(342);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      user: userName.trim() || 'Viewer',
      location: location.trim() || 'Lira City',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
  };

  return (
    <div className="bg-white rounded-brand border border-gray-200 overflow-hidden shadow-card flex flex-col h-[520px]">
      
      {/* Top Chat Header */}
      <div className="p-3.5 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-brand-gold" />
          <span className="font-heading font-black text-xs uppercase tracking-wide">
            Live Audience Reactions & Commentary
          </span>
        </div>

        {/* Live Reaction Heart Counter */}
        <button
          onClick={() => setLikes(l => l + 1)}
          className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-brand-crimson text-white text-xs font-bold hover:scale-105 active:scale-95 transition-transform"
        >
          <Heart className="w-3.5 h-3.5 fill-current text-white" />
          <span>{likes}</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-neutral-50/50 text-xs">
        {messages.map((msg) => (
          <div key={msg.id} className="p-2.5 bg-white rounded border border-gray-100 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center space-x-1 font-bold text-gray-900">
                <span>{msg.user}</span>
                {msg.isVerified && <ShieldCheck className="w-3 h-3 text-blue-600 inline" />}
                <span className="text-gray-400 font-normal text-[10px]">({msg.location})</span>
              </div>
              <span className="text-[10px] text-gray-400">{msg.time}</span>
            </div>
            <p className="text-gray-700 leading-relaxed font-sans">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Your Name (e.g. Moses)"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-brand-crimson"
          />
          <input
            type="text"
            placeholder="Your District / Town"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-brand-crimson"
          />
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Share your comment with the live studio..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-brand-crimson"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-brand-crimson hover:bg-brand-crimson-light text-white font-bold text-xs rounded transition-colors flex items-center space-x-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Post</span>
          </button>
        </div>
      </form>

    </div>
  );
}
