
export interface StaticTool {
  id: number;
  title: string;
  logoImage?: string;
  bgColor: string;
  textColor: 'white' | 'black';
  status: 'online' | 'offline' | 'maintenance';
  category: string;
}

export const staticToolsData: StaticTool[] = [
  {
    id: 1,
    title: "Adminer",
    logoImage: "https://i.postimg.cc/Pvx5Xndr/ADMINER.png",
    bgColor: "#000000",
    textColor: "white",
    status: "online",
    category: "Desenvolvimento"
  },
  {
    id: 2,
    title: "Blackhat",
    logoImage: "https://i.postimg.cc/HJgWJyTN/BLACKHAT.png",
    bgColor: "#1c1c1c",
    textColor: "white",
    status: "online",
    category: "Segurança"
  },
  {
    id: 3,
    title: "Paramount+",
    logoImage: "https://i.postimg.cc/PpMCfMZK/PARAMOUNT.png",
    bgColor: "#0075FF",
    textColor: "white",
    status: "online",
    category: "Streaming"
  },
  {
    id: 4,
    title: "Crunchyroll",
    logoImage: "https://i.postimg.cc/s1RPV6FP/CRUNCHYROLL.png",
    bgColor: "#FF5C00",
    textColor: "white",
    status: "online",
    category: "Streaming"
  },
  {
    id: 5,
    title: "Prime Video",
    logoImage: "https://i.postimg.cc/s1VB6tdL/PRIME-VIDEO.png",
    bgColor: "#32A4FF",
    textColor: "white",
    status: "online",
    category: "Streaming"
  },
  {
    id: 6,
    title: "Disney+",
    logoImage: "https://i.postimg.cc/1fmpF83f/DISNEY.png",
    bgColor: "#0C1B3D",
    textColor: "white",
    status: "online",
    category: "Streaming"
  },
  {
    id: 7,
    title: "Netflix Premium",
    logoImage: "https://i.postimg.cc/7C0Cd4ZF/NETFLIX-PREMIUM.png",
    bgColor: "#16070B",
    textColor: "white",
    status: "online",
    category: "Streaming"
  },
  {
    id: 8,
    title: "Spyhorus",
    logoImage: "https://i.postimg.cc/CZT5j2sm/SPYHORUS.png",
    bgColor: "#3C0B4A",
    textColor: "white",
    status: "online",
    category: "Espionagem"
  },
  {
    id: 9,
    title: "Canva Pro",
    logoImage: "https://i.postimg.cc/TyJdn3w3/CANVA-PRO.png",
    bgColor: "#2A0B3B",
    textColor: "white",
    status: "online",
    category: "Criativos"
  },
  {
    id: 10,
    title: "Adobe Stock",
    logoImage: "https://i.postimg.cc/t7CTtWFQ/ADOBE-STOCK.png",
    bgColor: "#E8E3FB",
    textColor: "black",
    status: "online",
    category: "Criativos"
  },
  {
    id: 11,
    title: "Flaticon",
    logoImage: "https://i.postimg.cc/hz8dznFL/FLATICON.png",
    bgColor: "#001421",
    textColor: "white",
    status: "online",
    category: "Criativos"
  },
  {
    id: 12,
    title: "Envato Elements",
    logoImage: "https://i.postimg.cc/68TnHFRK/ENVATO-ELEMENTS.png",
    bgColor: "#1E2609",
    textColor: "white",
    status: "online",
    category: "Criativos"
  },
  {
    id: 13,
    title: "Freepik",
    logoImage: "https://i.postimg.cc/LhRfdJfN/FREEPIK.png",
    bgColor: "#001F49",
    textColor: "white",
    status: "online",
    category: "Criativos"
  },
  {
    id: 14,
    title: "Storyblocks",
    logoImage: "https://i.postimg.cc/JDKhCzV2/STORYBLOCKS.png",
    bgColor: "#FFE53D",
    textColor: "black",
    status: "online",
    category: "Criativos"
  },
  {
    id: 15,
    title: "CapCut Pro",
    logoImage: "https://i.postimg.cc/9DTFFpHT/CAPCUT-PRO.png",
    bgColor: "#E4E4E4",
    textColor: "black",
    status: "online",
    category: "Criativos"
  },
  {
    id: 16,
    title: "LovePik",
    logoImage: "https://i.postimg.cc/jDWn6P0d/LOVEPIK.png",
    bgColor: "#081824",
    textColor: "white",
    status: "online",
    category: "Criativos"
  },
  {
    id: 17,
    title: "Vectorizer",
    logoImage: "https://i.postimg.cc/FdhK6JqS/VECTORIZER.png",
    bgColor: "#1B22A3",
    textColor: "white",
    status: "online",
    category: "Criativos"
  },
  {
    id: 18,
    title: "Epidemic Sound",
    logoImage: "https://i.postimg.cc/rDbW7gCr/EPIDEMIC-SOUND.png",
    bgColor: "#FFFFFF",
    textColor: "black",
    status: "online",
    category: "Áudio"
  },
  {
    id: 19,
    title: "ChatGPT",
    logoImage: "https://i.postimg.cc/Q9NXmZ9k/CHAT-GPT.png",
    bgColor: "#000000",
    textColor: "white",
    status: "online",
    category: "IA"
  },
  {
    id: 20,
    title: "Midjourney",
    logoImage: "https://i.postimg.cc/k6CVdHVB/MIDJOURNEY.png",
    bgColor: "#FFFFFF",
    textColor: "black",
    status: "online",
    category: "IA"
  },
  {
    id: 21,
    title: "Leonardo AI",
    logoImage: "https://i.postimg.cc/nX6j3rpK/LEONARD-IA.png",
    bgColor: "#260F2B",
    textColor: "white",
    status: "online",
    category: "IA"
  },
  {
    id: 22,
    title: "Gamma App",
    logoImage: "https://i.postimg.cc/4mx9djWc/GAMMA-APP.png",
    bgColor: "#23042E",
    textColor: "white",
    status: "online",
    category: "IA"
  },
  {
    id: 23,
    title: "HeyGen",
    logoImage: "https://i.postimg.cc/56KFFprR/HEYGEN.png",
    bgColor: "#1A102B",
    textColor: "white",
    status: "online",
    category: "IA"
  },
  {
    id: 24,
    title: "ChatBot X",
    logoImage: "https://i.postimg.cc/Pp6dFV1G/CHATBOT-X.png",
    bgColor: "#FFFFFF",
    textColor: "black",
    status: "online",
    category: "IA"
  },
  {
    id: 25,
    title: "Claude AI",
    logoImage: "https://i.postimg.cc/m1tTx3SP/CLAUDE-IA.png",
    bgColor: "#5A2F13",
    textColor: "white",
    status: "online",
    category: "IA"
  },
  {
    id: 26,
    title: "Dreamface",
    logoImage: "https://i.postimg.cc/ThqVhVGz/DREAMFACE.png",
    bgColor: "#42F7A2",
    textColor: "black",
    status: "online",
    category: "IA"
  },
  {
    id: 27,
    title: "Grok",
    logoImage: "https://i.postimg.cc/XX85nnk3/GROK.png",
    bgColor: "#FFFFFF",
    textColor: "black",
    status: "online",
    category: "IA"
  },
  {
    id: 28,
    title: "BigSpy",
    logoImage: "https://i.postimg.cc/jLBSb1mt/BIGSPY.png",
    bgColor: "#001428",
    textColor: "white",
    status: "online",
    category: "Espionagem"
  },
  {
    id: 29,
    title: "SpyHero",
    logoImage: "https://i.postimg.cc/yDSW3KcD/SPYHERO.png",
    bgColor: "#FFFFFF",
    textColor: "black",
    status: "online",
    category: "Espionagem"
  },
  {
    id: 30,
    title: "SpyGuru",
    logoImage: "https://i.postimg.cc/tYcYgJZ0/SPYGURU.png",
    bgColor: "#04111C",
    textColor: "white",
    status: "online",
    category: "Espionagem"
  },
  {
    id: 31,
    title: "Adsparo",
    logoImage: "https://i.postimg.cc/VdJk2w7K/ADSPARO.png",
    bgColor: "#450E22",
    textColor: "white",
    status: "online",
    category: "Mineração"
  },
  {
    id: 32,
    title: "Filtrify",
    logoImage: "https://i.postimg.cc/N9vXjMnG/FILTRIFY.png",
    bgColor: "#1B2837",
    textColor: "white",
    status: "online",
    category: "Mineração"
  },
  {
    id: 33,
    title: "Droptool",
    logoImage: "https://i.postimg.cc/SJgcfmnV/DROPTOOL.png",
    bgColor: "#F4EFFF",
    textColor: "black",
    status: "online",
    category: "Mineração"
  },
  {
    id: 34,
    title: "Pipiads",
    logoImage: "https://i.postimg.cc/5QN6XFSJ/PIPIADS.png",
    bgColor: "#FFFFFF",
    textColor: "black",
    status: "online",
    category: "Mineração"
  },
  {
    id: 35,
    title: "Semrush",
    logoImage: "https://i.postimg.cc/c6XvVXdL/SEMRUSH.png",
    bgColor: "#FF6A22",
    textColor: "white",
    status: "online",
    category: "SEO"
  },
  {
    id: 36,
    title: "Ubersuggest",
    logoImage: "https://i.postimg.cc/qtsRQGm0/UBERSUGGEST.png",
    bgColor: "#FF6A22",
    textColor: "white",
    status: "online",
    category: "SEO"
  },
  {
    id: 37,
    title: "SimilarWeb",
    logoImage: "https://i.postimg.cc/1fX8Pwzc/SIMILAR-WEB.png",
    bgColor: "#ECE4F5",
    textColor: "black",
    status: "online",
    category: "SEO"
  },
  {
    id: 38,
    title: "Answer The Public",
    logoImage: "https://i.postimg.cc/nMRLdr1s/ANSWER-THE-PUBLIC.png",
    bgColor: "#FFFFFF",
    textColor: "black",
    status: "online",
    category: "SEO"
  },
  {
    id: 39,
    title: "Freelahub",
    logoImage: "https://i.postimg.cc/BPq12zsd/FREELAHUB.png",
    bgColor: "#F5F9FF",
    textColor: "black",
    status: "online",
    category: "Freelancer"
  },
  {
    id: 40,
    title: "Clicopy",
    logoImage: "https://i.postimg.cc/7JVZDPFR/CLICOPY.png",
    bgColor: "#101D0F",
    textColor: "white",
    status: "online",
    category: "Copywriting"
  }
];
