export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  sessionId: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface User {
  username: string;
  isAuthenticated: boolean;
}