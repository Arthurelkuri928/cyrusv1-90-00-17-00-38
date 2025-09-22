
import { Users, Zap, Bell, Headphones, Award } from "lucide-react";
import { Plan, Feature } from "./types";

export const plans: Plan[] = [
  {
    name: "Teste",
    price: 0.99,
    period: "1 vez",
    validity: "7 dias (1 uso)",
    highlight: false
  },
  {
    name: "Mensal",
    price: 47.00,
    period: "mês",
    validity: "30 dias",
    highlight: false
  },
  {
    name: "Bimestral", 
    price: 97.00,
    period: "2 meses",
    validity: "60 dias",
    highlight: false
  },
  {
    name: "Trimestral",
    price: 147.00,
    period: "3 meses", 
    validity: "90 dias",
    highlight: true,
    badge: "Mais Vendido"
  },
  {
    name: "Semestral",
    price: 247.00,
    period: "6 meses",
    validity: "180 dias", 
    highlight: false
  },
  {
    name: "Anual",
    price: 397.00,
    period: "ano",
    validity: "12 meses",
    highlight: true,
    badge: "Melhor Custo-Benefício"
  },
  {
    name: "Vitalício",
    price: 547.00,
    period: "pagamento único",
    validity: "Acesso vitalício",
    highlight: false
  }
];

// Export icon components that will be used in JSX
export const featureIcons = {
  Users,
  Zap,
  Bell,
  Headphones,
  Award
};

export const featuresData = [
  {
    iconName: "Users" as keyof typeof featureIcons,
    name: "Ferramentas Premium",
    value: "40+"
  },
  {
    iconName: "Zap" as keyof typeof featureIcons,
    name: "Acesso Ilimitado",
    included: true
  },
  {
    iconName: "Bell" as keyof typeof featureIcons,
    name: "Suporte WhatsApp",
    included: true
  },
  {
    iconName: "Headphones" as keyof typeof featureIcons,
    name: "Suporte Prioritário",
    included: true
  },
  {
    iconName: "Award" as keyof typeof featureIcons,
    name: "Programa de Afiliados",
    included: true
  }
];
