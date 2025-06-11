import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Chat, Message, User } from './types';
import { sendMessageToHcatTrigger as sendMessage } from './services/api';
import { ArrowDown } from "lucide-react";

function App() {
  const [user, setUser] = useLocalStorage<User | null>('cybersec_user', null);
  const [chats, setChats] = useLocalStorage<Chat[]>('cybersec_chats', []);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Set current chat to first chat on load if none selected
  useEffect(() => {
    if (chats.length > 0 && !currentChatId) {
      setCurrentChatId(chats[0].id);
    }
  }, [chats, currentChatId]);

  const handleLogin = (username: string) => {
    setUser({ username, isAuthenticated: true });
  };

  const handleLogout = () => {
    setUser(null);
    setChats([]);
    setCurrentChatId(null);
  };

  const generateChatTitle = (firstMessage: string): string => {
    const words = firstMessage.split(' ').slice(0, 4);
    return words.join(' ') + (firstMessage.split(' ').length > 4 ? '...' : '');
  };

  const createNewChat = (): string => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'Nueva Conversación',
      sessionId: null,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setSidebarOpen(false);
    return newChat.id;
  };

  const handleNewChat = () => {
    createNewChat();
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setSidebarOpen(false);
  };

  const handleDeleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      setCurrentChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
    }
  };

  const handleSendMessage = async (content: string, chatId: string) => {
    if (!user || !content.trim()) return;
    let chatSelected: Chat | null = null;
    let isFirstMessage = false;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: Date.now(),
    };

    // Add user message immediately and update chat
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        chatSelected = chat;
        isFirstMessage = chat.messages.length === 0;
        const updatedChat = {
          ...chat,
          messages: [...chat.messages, userMessage],
          updatedAt: Date.now(),
          title: isFirstMessage ? generateChatTitle(content) : chat.title,
        };
        return updatedChat;
      }
      return chat;
    }));

    setIsLoading(true);

    try {
      const aiResponse = await sendMessage(content, chatSelected!.sessionId);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.message,
        sender: 'ai',
        timestamp: Date.now(),
      };

      setChats(prev => prev.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, userMessage, aiMessage],
            updatedAt: Date.now(),
            sessionId: isFirstMessage ? aiResponse.sessionId : chat.sessionId,
          };
        }
        return chat;
      }));
    } catch (error) {
      console.error('Error generating AI response:', error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Disculpa, encontré un error procesando tu solicitud. Por favor intenta de nuevo.',
        sender: 'ai',
        timestamp: Date.now(),
      };

      setChats(prev => prev.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, errorMessage],
            updatedAt: Date.now(),
          };
        }
        return chat;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const currentChat = chats.find(chat => chat.id === currentChatId) || null;

  if (!user?.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen flex bg-gray-900 text-white">
        
        <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onLogout={handleLogout}
        username={user.username}
        />

      <div className="flex-1 flex flex-col lg:ml-0 overflow-y-auto chat-messages-container">
        <ChatInterface
          currentChat={currentChat}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
        {currentChat && currentChat.messages.length > 0 && (
            <button
            className="fixed bottom-24 right-6 text-white p-4 rounded shadow-lg z-50 bg-gray-700/50 flex items-center justify-center rounded-xl"
            onClick={() => {
              const chatContainer = document.querySelector('.chat-messages-container');
              if (chatContainer) {
              chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
              }
            }}
            type="button"
            >
            <ArrowDown className="w-6 h-6" />
            </button>
        )}
      </div>
    </div>
  );
}

export default App;