import React, { useState, FC } from 'react';
import { Search, ChevronLeft, ChevronRight, Menu, Paperclip, Send } from 'lucide-react';

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
  from: 'me' | 'other';
  text: string;
  time: string;
}

interface MessagesData {
  [key: number]: Message[];
}

// --- DADOS DE EXEMPLO ---
const contactsData: Contact[] = [
  { id: 1, name: 'Jimmy Seinz', avatar: 'https://i.pravatar.cc/40?u=jimmy', online: true, lastMessage: "Yes, I've seen the payslip...", time: '10:10 AM', unread: 0, typing: true },
  { id: 2, name: 'Selly Deluna', avatar: 'https://i.pravatar.cc/40?u=selly', online: false, lastMessage: 'Just a quick reminder that the payro...', time: '10:09 AM', unread: 2 },
  { id: 3, name: 'Lana Delrey', avatar: 'https://i.pravatar.cc/40?u=lana', online: false, lastMessage: "Hey there, I've processed the payro...", time: '10:08 AM', unread: 3 },
  { id: 4, name: 'Momo Ryn', avatar: 'https://i.pravatar.cc/40?u=momo', online: true, lastMessage: 'Hi there, I noticed an issue with the...', time: '10:07 AM', unread: 1 },
];

const messagesData: MessagesData = {
  1: [
    { from: 'other', text: 'Hi Admin, I wanted to ask about my salary this month. Why is the amount different from what I usually receive?', time: '10:10 AM' },
    { from: 'me', text: 'Hi Jimmy, thanks for reaching out. Let me check the details for you. Have you looked at your payslip for this month? It could be due to changes in deductions or overtime.', time: '10:10 AM' },
    { from: 'other', text: "Yes, I've seen the payslip, and it looks like the tax deductions are higher than last month. Was there a change in the tax regulations?", time: '10:11 AM' },
  ],
  2: [{ from: 'other', text: 'Just a quick reminder that the payroll needs to be approved by EOD.', time: '10:09 AM' }],
  3: [{ from: 'other', text: "Hey there, I've processed the payroll for this cycle.", time: '10:08 AM' }],
  4: [{ from: 'other', text: 'Hi there, I noticed an issue with the latest invoice.', time: '10:07 AM' }],
};

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
              <p className={`text-xs truncate ${
                contact.typing ? 'text-green-500 animate-pulse' : 'text-muted-foreground'
              }`}>
                {contact.typing ? 'digitando...' : contact.lastMessage}
              </p>
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
}

const ChatWindow: FC<ChatWindowProps> = ({ 
  contact, 
  messages, 
  isSidebarCollapsed, 
  onToggleSidebar 
}) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Aqui você adicionaria a lógica para enviar mensagem
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
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
        <div className="ml-auto">
          <Menu className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
        </div>
      </div>

      {/* Corpo das Mensagens */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md p-3 rounded-2xl ${
              msg.from === 'me' 
                ? 'bg-primary text-primary-foreground rounded-br-none' 
                : 'bg-muted text-foreground rounded-bl-none'
            }`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 opacity-70`}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input de Mensagem */}
      <form onSubmit={handleSendMessage} className="p-4 flex items-center gap-4 border-t border-border flex-shrink-0">
        <Paperclip className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
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
  );
};

// --- COMPONENTE PRINCIPAL ---
export function FunctionalChatPage() {
  const [contacts, setContacts] = useState<Contact[]>(contactsData);
  const [messages, setMessages] = useState<MessagesData>(messagesData);
  const [activeContactId, setActiveContactId] = useState<number>(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];
  const activeMessages = messages[activeContactId] || [];
  
  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen w-full bg-background font-sans">
      <ContactSidebar 
        contacts={contacts} 
        activeContactId={activeContactId} 
        onSelectContact={setActiveContactId}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <ChatWindow 
        contact={activeContact} 
        messages={activeMessages}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleCollapse}
      />
    </div>
  );
}