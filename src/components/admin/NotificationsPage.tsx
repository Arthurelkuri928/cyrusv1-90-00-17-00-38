
import React, { useState, useEffect, useRef, FC } from 'react';
import { Search, ChevronLeft, ChevronRight, Send, Reply, X, Check, CheckCheck } from 'lucide-react';

// --- TIPOS ---
interface Contact {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  lastMessage: string;
  time: string;
  unread: number;
  typing?: boolean;
}

interface Message {
  id: string;
  from: 'me' | 'other';
  text: string;
  time: string;
  status?: 'sent' | 'read';
  replyingTo?: {
    name: string;
    text: string;
  };
}

interface MessagesData {
  [key: number]: Message[];
}

// --- DADOS DE EXEMPLO ---
const initialContacts: Contact[] = [
  { id: 1, name: 'Jimmy Seinz', avatar: 'https://i.pravatar.cc/40?u=jimmy', online: true, lastMessage: "Yes, I've seen the payslip...", time: '10:11 AM', unread: 0, typing: true },
  { id: 2, name: 'Selly Deluna', avatar: 'https://i.pravatar.cc/40?u=selly', online: false, lastMessage: 'Just a quick reminder that the payro...', time: '10:09 AM', unread: 2 },
  { id: 3, name: 'Lana Delrey', avatar: 'https://i.pravatar.cc/40?u=lana', online: false, lastMessage: "Hey there, I've processed the payro...", time: '10:08 AM', unread: 3 },
];

const initialMessages: MessagesData = {
  1: [
    { id: 'msg1', from: 'other', text: 'Hi Admin, I wanted to ask about my salary this month.', time: '10:10 AM' },
    { id: 'msg2', from: 'me', text: 'Hi Jimmy, thanks for reaching out. Let me check the details for you.', time: '10:10 AM', status: 'read' },
    { id: 'msg3', from: 'other', text: "Yes, I've seen the payslip, and it looks like the tax deductions are higher than last month.", time: '10:11 AM' },
  ],
  2: [{ id: 'msg4', from: 'other', text: 'Just a quick reminder that the payroll needs to be approved by EOD.', time: '10:09 AM' }],
  3: [{ id: 'msg5', from: 'other', text: "Hey there, I've processed the payroll for this cycle.", time: '10:08 AM' }],
};

// --- SUB-COMPONENTES AUXILIARES ---
const TypingIndicator = () => (
  <div className="flex items-center gap-1">
    <span>digitando</span>
    <span className="animate-[bounce_1s_infinite_100ms] h-1 w-1 bg-green-400 rounded-full"></span>
    <span className="animate-[bounce_1s_infinite_200ms] h-1 w-1 bg-green-400 rounded-full"></span>
    <span className="animate-[bounce_1s_infinite_300ms] h-1 w-1 bg-green-400 rounded-full"></span>
  </div>
);

const MessageStatus: FC<{ status: 'sent' | 'read' }> = ({ status }) => 
  status === 'read' ? <CheckCheck className="h-4 w-4 text-blue-400" /> : <Check className="h-4 w-4 text-muted-foreground" />;

// --- SUB-COMPONENTES ---

interface ContactSidebarProps {
  contacts: Contact[];
  activeContactId: number;
  onSelectContact: (id: number) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const ContactSidebar: FC<ContactSidebarProps> = ({ 
  contacts, 
  activeContactId, 
  onSelectContact, 
  isCollapsed, 
  onToggleCollapse 
}) => (
  <div className={`transition-all duration-300 ease-in-out bg-background border-r border-border flex flex-col ${isCollapsed ? 'w-0' : 'w-80'}`} style={{ overflow: 'hidden' }}>
    <div className="p-4 border-b border-border flex-shrink-0">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Mensagens</h2>
        <button onClick={onToggleCollapse} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-5 w-5"/>
        </button>
      </div>
      <div className="relative mt-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Buscar..." 
          className="w-full bg-muted border border-border rounded-md h-9 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
        />
      </div>
    </div>
    <div className="flex-1 overflow-y-auto">
      {contacts.map(contact => (
        <div 
          key={contact.id} 
          onClick={() => onSelectContact(contact.id)}
          className={`flex items-center gap-3 p-3 cursor-pointer border-l-2 transition-all hover:bg-muted/50 ${
            activeContactId === contact.id 
              ? 'bg-muted border-primary' 
              : 'border-transparent'
          }`}
        >
          <div className="relative">
            <img src={contact.avatar} alt={contact.name} className="h-10 w-10 rounded-full" />
            {contact.online && (
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-foreground truncate">{contact.name}</p>
              <p className="text-xs text-muted-foreground">{contact.time}</p>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs truncate text-muted-foreground">
                {contact.typing ? <TypingIndicator /> : <p>{contact.lastMessage}</p>}
              </div>
              {contact.unread > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem]">
                  {contact.unread}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

interface ChatWindowProps {
  contact: Contact;
  messages: Message[];
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onSendMessage: (text: string, replyingTo?: Message) => void;
}

const ChatWindow: FC<ChatWindowProps> = ({ 
  contact, 
  messages, 
  isSidebarCollapsed, 
  onToggleSidebar,
  onSendMessage
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim(), replyingToMessage || undefined);
      setNewMessage('');
      setReplyingToMessage(null);
    }
  };

  const handleStartReply = (message: Message) => {
    setReplyingToMessage(message);
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Cabeçalho do Chat */}
      <div className="flex items-center p-4 border-b border-border flex-shrink-0">
        {isSidebarCollapsed && (
          <button 
            onClick={onToggleSidebar} 
            className="mr-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="h-5 w-5"/>
          </button>
        )}
        <div className="relative">
          <img src={contact.avatar} alt={contact.name} className="h-10 w-10 rounded-full" />
          {contact.online && (
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
          )}
        </div>
        <div className="ml-3">
          <p className="text-base font-semibold text-foreground">{contact.name}</p>
          <p className="text-xs text-green-500">{contact.online ? 'Online' : 'Offline'}</p>
        </div>
      </div>

      {/* Corpo das Mensagens */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2 group ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            {msg.from === 'other' && (
              <button 
                onClick={() => handleStartReply(msg)} 
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
              >
                <Reply className="h-4 w-4"/>
              </button>
            )}
            <div className={`max-w-md p-3 rounded-2xl ${
              msg.from === 'me' 
                ? 'bg-primary text-primary-foreground rounded-br-none' 
                : 'bg-muted text-foreground rounded-bl-none'
            }`}>
              {msg.replyingTo && (
                <div className="border-l-2 border-primary/50 pl-2 text-xs opacity-80 mb-2">
                  <p className="font-bold text-primary/80">{msg.replyingTo.name}</p>
                  <p className="line-clamp-1">{msg.replyingTo.text}</p>
                </div>
              )}
              <p className="text-sm">{msg.text}</p>
              <div className={`flex items-center gap-1 justify-end text-xs mt-1 opacity-70`}>
                <span>{msg.time}</span>
                {msg.from === 'me' && msg.status && <MessageStatus status={msg.status} />}
              </div>
            </div>
            {msg.from === 'me' && (
              <button 
                onClick={() => handleStartReply(msg)} 
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
              >
                <Reply className="h-4 w-4"/>
              </button>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input de Mensagem */}
      <div className="p-4 border-t border-border">
        {replyingToMessage && (
          <div className="bg-muted/50 p-2 rounded-t-lg flex justify-between items-center mb-2">
            <div className="border-l-2 border-primary pl-2 text-sm">
              <p className="font-bold text-primary">Respondendo a {contact.name}</p>
              <p className="text-muted-foreground line-clamp-1">{replyingToMessage.text}</p>
            </div>
            <button onClick={() => setReplyingToMessage(null)}>
              <X className="h-5 w-5 text-muted-foreground hover:text-foreground"/>
            </button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center gap-4">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite uma mensagem..." 
            className="flex-1 bg-muted rounded-lg h-10 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border-0" 
          />
          <button 
            type="submit"
            className="bg-primary rounded-lg h-10 w-10 flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            disabled={!newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export function AdvancedFunctionalChat() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [messages, setMessages] = useState<MessagesData>(initialMessages);
  const [activeContactId, setActiveContactId] = useState<number>(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];
  const activeMessages = messages[activeContactId] || [];
  
  const handleSelectContact = (contactId: number) => {
    setActiveContactId(contactId);
    
    // Marca mensagens como lidas
    const updatedContacts = contacts.map(c => 
      c.id === contactId ? { ...c, unread: 0 } : c
    );
    setContacts(updatedContacts);
  };

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSendMessage = (text: string, replyingTo?: Message) => {
    const newMessage: Message = {
      id: `msg${Date.now()}`,
      from: 'me',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      ...(replyingTo && { 
        replyingTo: { 
          name: activeContact.name, 
          text: replyingTo.text 
        } 
      }),
    };

    // Atualiza o estado das mensagens
    const updatedMessages = { 
      ...messages, 
      [activeContactId]: [...activeMessages, newMessage] 
    };
    setMessages(updatedMessages);

    // Atualiza a prévia na sidebar
    const previewText = replyingTo ? `Você respondeu: ${text}` : text;
    const updatedContacts = contacts.map(c => 
      c.id === activeContactId 
        ? { ...c, lastMessage: previewText, time: newMessage.time } 
        : c
    );
    setContacts(updatedContacts);
  };

  return (
    <div className="flex h-screen w-full bg-background font-sans">
      <ContactSidebar 
        contacts={contacts} 
        activeContactId={activeContactId} 
        onSelectContact={handleSelectContact}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <ChatWindow 
        contact={activeContact} 
        messages={activeMessages}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleCollapse}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

export const NotificationsPage: React.FC = () => {
  return <AdvancedFunctionalChat />;
};
