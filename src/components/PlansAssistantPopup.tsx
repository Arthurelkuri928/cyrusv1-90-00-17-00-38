
import React from 'react';
import { X, Smile, Paperclip, Mic } from 'lucide-react';
import { usePlansAssistantFlow } from '@/hooks/usePlansAssistantFlow';

interface PlansAssistantPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlansAssistantPopup: React.FC<PlansAssistantPopupProps> = ({ isOpen, onClose }) => {
  const { messages, isTyping, messagesEndRef, handleOptionClick, resetChat } = usePlansAssistantFlow(isOpen);

  const handleClose = () => {
    resetChat();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center animate-fade-in">
      <div 
        className="w-full h-full bg-white flex flex-col animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-title"
      >
        {/* Header - Estilo WhatsApp */}
        <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="https://i.postimg.cc/8cR9jCyx/2.png" 
              alt="Cyrus Logo" 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 id="chat-title" className="font-semibold text-lg">Cyrus</h2>
              <p className="text-[#25D366] text-sm">Online</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Fechar assistente"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Área de Conversa - Fundo WhatsApp */}
        <div 
          className="flex-1 overflow-y-auto p-4"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='a' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(0.5) rotate(0)'%3e%3crect x='0' y='0' width='100%25' height='100%25' fill='%23f0f0f0'/%3e%3cpath d='M20 0v40M0 20h40' stroke='%23e5e5e5' stroke-width='0.5' opacity='0.3'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23a)'/%3e%3c/svg%3e")`,
            backgroundColor: '#f0f0f0'
          }}
        >
          {/* Mensagens */}
          {messages.map((message) => (
            <div key={message.id} className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                message.sender === 'user' 
                  ? 'bg-[#25D366] text-white' 
                  : 'bg-[#DCF8C6] text-gray-800'
              }`}>
                <p>{message.text}</p>
                <span className={`text-xs mt-1 block ${
                  message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </span>
                
                {/* Opções de resposta */}
                {message.options && (
                  <div className="mt-3 space-y-2">
                    {message.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        className="block w-full text-left px-3 py-2 border border-[#6B21A8] text-[#6B21A8] rounded-full text-sm hover:bg-[#6B21A8] hover:text-white transition-all duration-200"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {/* Botão de ação final */}
                {message.button && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={message.button.action}
                      className="bg-gradient-to-r from-[#8b5cf6] to-[#a259ff] text-white font-bold px-6 py-3 rounded-full text-sm hover:from-[#7c3aed] hover:to-[#9333ea] transition-all duration-300 shadow-lg transform hover:scale-105"
                    >
                      {message.button.text}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Indicador de digitação */}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-[#DCF8C6] max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm">
                <p className="text-gray-600 italic">Cyrus está digitando...</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Caixa de Mensagem Simulada - Estilo WhatsApp */}
        <div className="bg-[#f0f0f0] p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 bg-white rounded-full px-4 py-2 shadow-sm">
            <Smile className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
            <Paperclip className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
            <input
              type="text"
              placeholder="Digite uma mensagem"
              className="flex-1 bg-transparent outline-none text-gray-700"
              disabled
            />
            <Mic className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansAssistantPopup;
