import React from 'react';
import { User, Bot, Copy, Check } from 'lucide-react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.sender === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex items-start space-x-4 mb-6 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
          <Bot className="w-4 h-4 text-green-400" />
        </div>
      )}

      <div className={`flex flex-col max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`relative group px-4 py-3 rounded-2xl ${isUser
            ? 'bg-green-600 text-white rounded-br-md'
            : 'bg-gray-700/50 text-gray-100 rounded-bl-md border border-gray-600/50'
          }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            <ReactMarkdown>
              {message.content}
            </ReactMarkdown>
          </p>

          {!isUser && (
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-gray-600/50 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-all"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 mt-1 px-2">
          <span className="text-xs text-gray-400">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
          <User className="w-4 h-4 text-blue-400" />
        </div>
      )}
    </div>
  );
};