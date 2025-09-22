
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: string;
  options?: string[];
  button?: {
    text: string;
    action: () => void;
  };
}

export const usePlansAssistantFlow = (isOpen: boolean) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions = [
    {
      text: 'Com que frequência você utiliza ferramentas de IA?',
      options: ['Uso ocasionalmente', 'Uso com frequência', 'Uso intensamente todos os dias']
    },
    {
      text: 'Quantas ferramentas diferentes você costuma utilizar?',
      options: ['Até 3 ferramentas', 'De 4 a 7 ferramentas', 'Mais de 7 ferramentas']
    },
    {
      text: 'O que você mais valoriza no seu plano?',
      options: ['Economia e baixo custo', 'Acesso equilibrado e estável', 'Acesso total sem limites']
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !hasStarted) {
      const initialMessages: Message[] = [
        {
          id: '1',
          text: 'Olá! 👋 Sou a assistente da Cyrus e estou aqui para te ajudar a escolher o plano perfeito para suas necessidades!',
          sender: 'bot',
          timestamp: '12:30'
        },
        {
          id: '2',
          text: 'Está em dúvida sobre qual plano escolher? Responda algumas perguntas rápidas e te ajudaremos a encontrar o plano ideal para o seu momento.',
          sender: 'bot',
          timestamp: '12:30',
          options: ['Começar']
        }
      ];
      setMessages(initialMessages);
      setHasStarted(true);
    }
  }, [isOpen, hasStarted]);

  const simulateTyping = () => {
    setIsTyping(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setIsTyping(false);
        resolve(undefined);
      }, 1000);
    });
  };

  const addMessage = (text: string, sender: 'bot' | 'user', options?: string[], button?: { text: string; action: () => void }) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      options,
      button
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const determineRecommendedPlan = (finalAnswer: string) => {
    switch (finalAnswer) {
      case 'Economia e baixo custo':
        return 'planos-iniciais';
      case 'Acesso equilibrado e estável':
        return 'planos-padroes';
      case 'Acesso total sem limites':
        return 'planos-premium';
      default:
        return 'planos-iniciais';
    }
  };

  const redirectToSpecificPlan = (planType: string) => {
    navigate(`/${planType}`);
  };

  const handleOptionClick = async (option: string) => {
    addMessage(option, 'user');
    
    const newAnswers = [...userAnswers, option];
    setUserAnswers(newAnswers);

    setMessages(prev => prev.map(msg => ({ ...msg, options: undefined })));

    await new Promise(resolve => setTimeout(resolve, 600));

    if (option === 'Começar') {
      await simulateTyping();
      addMessage(questions[0].text, 'bot', questions[0].options);
      setCurrentStep(1);
    } else if (currentStep < questions.length) {
      await simulateTyping();
      if (currentStep < questions.length) {
        addMessage(questions[currentStep].text, 'bot', questions[currentStep].options);
        setCurrentStep(currentStep + 1);
      }
    } else {
      // Usuário respondeu a última pergunta
      const recommendedPlan = determineRecommendedPlan(option);
      
      await simulateTyping();
      addMessage(
        'Perfeito! Estamos levando você para o plano que mais se encaixa no seu momento...',
        'bot',
        undefined,
        {
          text: 'Ver meu plano',
          action: () => redirectToSpecificPlan(recommendedPlan)
        }
      );

      // Redirecionamento automático após 2 segundos
      setTimeout(() => {
        redirectToSpecificPlan(recommendedPlan);
      }, 2000);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setCurrentStep(0);
    setUserAnswers([]);
    setIsTyping(false);
    setHasStarted(false);
  };

  return {
    messages,
    isTyping,
    messagesEndRef,
    handleOptionClick,
    resetChat
  };
};
