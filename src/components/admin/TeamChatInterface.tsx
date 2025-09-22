import React, { useState, useEffect, useRef } from 'react';
import { Send, Check, CheckCheck, MessageSquareReply, X } from 'lucide-react';

// --- TIPOS ---
type MessageStatus = 'sent' | 'delivered' | 'read';
type MessageSender = 'user' | 'contact';

interface Message {
  id: number;
  text: string;
  sender: MessageSender;
  timestamp: string;
  status: MessageStatus;
  replyingTo?: Message;
}

// --- DADOS DE EXEMPLO ---
const initialMessages: Message[] = [
  { id: 1, text: 'Olá! Queria verificar o andamento do projeto X.', sender: 'contact', timestamp: '10:10 AM', status: 'delivered' },
  { id: 2, text: 'Claro! Acabei de subir as últimas atualizações no repositório. O front-end está quase finalizado.', sender: 'user', timestamp: '10:11 AM', status: 'read' },
  { id: 3, text: 'Ótimo! Vou dar uma olhada agora. Obrigado!', sender: 'contact', timestamp: '10:11 AM', status: 'delivered' },
  { id: 4, text: 'Me avise se encontrar qualquer problema.', sender: 'user', timestamp: '10:12 AM', status: 'delivered' },
  { id: 5, text: 'Perfeito, combinado!', sender: 'contact', timestamp: '10:13 AM', status: 'sent' },
];

// --- COMPONENTES ---

const StatusIcon = ({ status }: { status: MessageStatus }) => {
  if (status === 'read') return <CheckCheck size={16} className="text-blue-400" />;
  if (status === 'delivered') return <CheckCheck size={16} className="text-gray-400" />;
  return <Check size={16} className="text-gray-400" />;
};

const ReplyPreview = ({ message, onCancel }: { message: Message; onCancel: () => void; }) => (
    <div className="flex items-center justify-between bg-gray-800/50 p-2 rounded-t-lg border-b border-l-2 border-purple-500">
        <div className="text-xs text-gray-300 overflow-hidden">
            <p className="font-semibold text-purple-400">Respondendo a {message.sender === 'user' ? 'Você' : 'Jimmy Seinz'}</p>
            <p className="truncate">{message.text}</p>
        </div>
        <button onClick={onCancel} className="p-1 rounded-full hover:bg-gray-700">
            <X size={16} className="text-gray-400" />
        </button>
    </div>
);

const MessageBubble = ({ message, onDoubleClick, onReply }: { message: Message; onDoubleClick: (id: number) => void; onReply: (message: Message) => void; }) => {
    const isUser = message.sender === 'user';
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className={`flex items-end gap-2 my-2 ${isUser ? 'justify-end' : 'justify-start'}`}
            onDoubleClick={() => !isUser && onDoubleClick(message.id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {!isUser && <img src="https://i.pravatar.cc/40?u=jimmy" alt="Avatar" className="w-8 h-8 rounded-full mb-1" />}
            <div className={`relative max-w-md lg:max-w-lg p-3 rounded-lg ${isUser ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                {message.replyingTo && (
                    <div className="mb-2 p-2 border-l-2 border-purple-400 bg-black/20 rounded-md">
                        <p className="text-xs font-semibold text-purple-300">{message.replyingTo.sender === 'user' ? 'Você' : 'Jimmy Seinz'}</p>
                        <p className="text-sm text-gray-300 truncate">{message.replyingTo.text}</p>
                    </div>
                )}
                <p className="text-sm">{message.text}</p>
                <div className="flex justify-end items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{message.timestamp}</span>
                    {isUser && <StatusIcon status={message.status} />}
                </div>
                {isHovered && (
                     <button onClick={() => onReply(message)} className="absolute top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-900/50 hover:bg-gray-900 transition-all" style={isUser ? { left: '-2.5rem' } : { right: '-2.5rem' }}>
                        <MessageSquareReply size={16} className="text-gray-300" />
                    </button>
                )}
            </div>
        </div>
    );
};

export const TeamChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (inputValue) {
        setIsTyping(true);
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
        }, 1500);
    } else {
        setIsTyping(false);
    }
  }, [inputValue]);
  
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      ...(replyingTo && { replyingTo: replyingTo }),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setReplyingTo(null);
  };

  const handleDoubleClick = (id: number) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, status: 'read' } : msg
    ));
  };
  
  const handleReply = (message: Message) => {
      setReplyingTo(message);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full bg-gray-900 text-white rounded-lg">
      {/* Cabeçalho do Chat */}
      <div className="flex items-center p-4 border-b border-gray-700">
        <img src="https://i.pravatar.cc/40?u=jimmy" alt="Avatar" className="w-10 h-10 rounded-full mr-4" />
        <div>
          <h2 className="font-semibold">Jimmy Seinz</h2>
          {isTyping ? (
             <p className="text-xs text-purple-400 animate-pulse">está digitando...</p>
          ) : (
            <p className="text-xs text-gray-400">Online</p>
          )}
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} onDoubleClick={handleDoubleClick} onReply={handleReply} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Campo de Entrada */}
      <div className="p-4 border-t border-gray-700">
          {replyingTo && <ReplyPreview message={replyingTo} onCancel={() => setReplyingTo(null)} />}
          <div className={`relative flex items-center bg-gray-800 ${replyingTo ? 'rounded-b-lg' : 'rounded-lg'}`}>
              <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite uma mensagem..."
                  className="w-full bg-transparent p-3 pr-12 focus:outline-none text-gray-200 placeholder-gray-500"
              />
              <button
                  onClick={handleSendMessage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 transition-colors"
                  disabled={!inputValue.trim()}
              >
                  <Send size={18} className="text-white" />
              </button>
          </div>
      </div>
    </div>
  );
};