import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { Chat, Message } from '../types';
import { WELCOME_DESCRIPTION, WELCOME_TITLE } from '../data/appData';

interface ChatInterfaceProps {
  currentChat: Chat | null;
  onSendMessage: (content: string, chatId: string) => void;
  isLoading: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentChat,
  onSendMessage,
  isLoading
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentChat || isLoading) return;
    
    onSendMessage(input.trim(), currentChat.id);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🛡️</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{WELCOME_TITLE}</h2>
          <p className="text-gray-400 max-w-md">
            {WELCOME_DESCRIPTION}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* Chat Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
        <h2 className="text-lg font-semibold text-white truncate">
          {currentChat.title}
        </h2>
        <p className="text-sm text-gray-400">
          Asistente Especializado en Ciberseguridad • Siempre Online
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {currentChat.messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">💬</span>
              </div>
              <p className="text-gray-400 mb-4">
                ¡Hola! Soy tu asistente de ciberseguridad. ¿En qué puedo ayudarte hoy?
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => onSendMessage('¿Cómo puedo protegerme del malware?', currentChat.id)}
                  className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-sm text-gray-300 transition-colors"
                >
                  Protección contra malware
                </button>
                <button
                  onClick={() => onSendMessage('¿Qué es el phishing y cómo evitarlo?', currentChat.id)}
                  className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-sm text-gray-300 transition-colors"
                >
                  Prevenir phishing
                </button>
                <button
                  onClick={() => onSendMessage('¿Cómo crear contraseñas seguras?', currentChat.id)}
                  className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-sm text-gray-300 transition-colors"
                >
                  Contraseñas seguras
                </button>
              </div>
            </div>
          ) : (
            currentChat.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          
          {isLoading && (
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
              </div>
              <div className="bg-gray-700/50 border border-gray-600/50 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje aquí..."
              className="w-full pr-12 pl-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors resize-none max-h-32"
              rows={1}
              disabled={isLoading}
            />
            <button
            aria-label='Enviar mensaje'
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2   p-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />

            </button>
          </div>
        </form>
      </div>
    </div>
  );
};