
export interface Category {
  id: string;
  label: string;
}

export const categories: Category[] = [
  {
    id: "all",
    label: "Todas as Ferramentas"
  },
  {
    id: "new",
    label: "Novas Ferramentas"
  },
  {
    id: "ia",
    label: "Inteligência Artificial"
  },
  {
    id: "espionagem",
    label: "Espionagem"
  },
  {
    id: "mineracao",
    label: "Mineração"
  },
  {
    id: "seo",
    label: "SEO"
  },
  {
    id: "streaming",
    label: "Streaming"
  },
  {
    id: "design",
    label: "Design"
  },
  {
    id: "diversos",
    label: "Diversos"
  },
  {
    id: "offline",
    label: "Offline"
  },
  {
    id: "maintenance",
    label: "Manutenção"
  }
];
