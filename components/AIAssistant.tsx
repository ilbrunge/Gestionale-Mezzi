
import React, { useState } from 'react';
import { Vehicle } from '../types';
import { getFleetAdvice } from '../services/geminiService';
import { Sparkles, Send, Bot, User } from 'lucide-react';

interface AIAssistantProps {
  vehicles: Vehicle[];
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ vehicles }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;
    
    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const advice = await getFleetAdvice(vehicles, userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: advice || 'Nessun consiglio disponibile.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Errore durante la consultazione AI.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b bg-blue-50 flex items-center gap-2">
        <Sparkles className="text-blue-600" />
        <h2 className="font-bold text-blue-900">Fleet Intelligence Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600">
              <Bot size={32} />
            </div>
            <div className="max-w-xs mx-auto text-gray-500">
              <p className="font-medium text-gray-700">Chiedi consigli sulla tua flotta</p>
              <p className="text-sm">"Quali mezzi dovrei revisionare il mese prossimo?" o "Come posso ottimizzare la durata dei filtri?"</p>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-70 text-[10px] font-bold uppercase tracking-widest">
                {m.role === 'user' ? <User size={12}/> : <Bot size={12}/>}
                {m.role === 'user' ? 'Io' : 'Fleet AI'}
              </div>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none border border-gray-200 animate-pulse flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
              </div>
              <span className="text-xs font-medium text-gray-500">Analisi flotta in corso...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Chiedi alla flotta..."
            className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2 text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
