import React, { useState, useEffect, FC } from 'react';
import {
    LayoutDashboard, Users, Bell, MessageSquare, Wrench, Megaphone, Eye, Link as LinkIcon,
    Settings, ShieldCheck, BarChart2, User, FileText, Star, Share2, Trash2, Rows,
    ArrowDownUp, Filter, Download, UserPlus, CheckCircle, Grid, Calendar, Power, ListTodo,
    Database, Cloud, Save, Key, Palette, Search
} from 'lucide-react';

// --- CONFIGURAÇÃO VISUAL COMPLETA E ATUALIZADA DA TOPBAR ---
const topbarConfig = {
  dashboard: {
    tabs: [ 
      { id: 'todos', label: 'Todos' }, 
      { id: 'meus_docs', label: 'Meus docs' }, 
      { id: 'favoritos', label: 'Favoritos' }, 
      { id: 'compartilhados', label: 'Compartilhados' }, 
      { id: 'removidos', label: 'Removidos' } 
    ],
    actions: [ 
      { id: 'agrupar', label: 'Agrupar', icon: Rows }, 
      { id: 'ordenar', label: 'Ordenar', icon: ArrowDownUp }, 
      { id: 'visualizar', label: 'Visualizar', icon: Eye }, 
      { id: 'filtrar', label: 'Filtrar', icon: Filter } 
    ]
  },
  usuarios: {
    tabs: [ 
      { id: 'todos', label: 'Todos os Usuários' }, 
      { id: 'ativos', label: 'Ativos' }, 
      { id: 'expirados', label: 'Expirados' }, 
      { id: 'suspensos', label: 'Suspensos' } 
    ],
    actions: [ 
      { id: 'filtrar_cargo', label: 'Filtrar por Cargo', icon: Filter }, 
      { id: 'exportar', label: 'Exportar Lista', icon: Download }, 
      { id: 'criar_usuario', label: 'Criar Usuário', icon: UserPlus, primary: true } 
    ]
  },
  notificacoes: {
    tabs: [ 
      { id: 'todas', label: 'Todas' }, 
      { id: 'nao_lidas', label: 'Não Lidas' }, 
      { id: 'lidas', label: 'Lidas' }, 
      { id: 'arquivadas', label: 'Arquivadas' } 
    ],
    actions: [ 
      { id: 'marcar_lida', label: 'Marcar todas como lidas', icon: CheckCircle }, 
      { id: 'filtrar_data', label: 'Filtrar por Data', icon: Filter } 
    ]
  },
  enviar_mensagem: {
    tabs: [ 
      { id: 'nova', label: 'Nova Mensagem' }, 
      { id: 'rascunhos', label: 'Rascunhos' }, 
      { id: 'enviadas', label: 'Enviadas' }, 
      { id: 'agendadas', label: 'Agendadas' } 
    ],
    actions: [ 
      { id: 'anexar', label: 'Anexar Arquivo', icon: LinkIcon }, 
      { id: 'salvar', label: 'Salvar Rascunho', icon: Save }, 
      { id: 'enviar', label: 'Enviar Mensagem', icon: MessageSquare, primary: true } 
    ]
  },
  ferramentas: {
    tabs: [ 
      { id: 'todas', label: 'Todas' }, 
      { id: 'analise', label: 'Análise' }, 
      { id: 'dev', label: 'Desenvolvimento' }, 
      { id: 'marketing', label: 'Marketing' } 
    ],
    actions: [ 
      { id: 'visualizar_grade', label: 'Ver em Grade', icon: Grid }, 
      { id: 'nova_ferramenta', label: 'Nova Ferramenta', icon: Wrench, primary: true } 
    ]
  },
  anuncios: {
    tabs: [ 
      { id: 'todos', label: 'Todos' }, 
      { id: 'ativos', label: 'Ativos' }, 
      { id: 'pausados', label: 'Pausados' }, 
      { id: 'concluidos', label: 'Concluídos' } 
    ],
    actions: [ 
      { id: 'filtrar_campanha', label: 'Filtrar por Campanha', icon: Filter }, 
      { id: 'exportar', label: 'Exportar Relatório', icon: Download }, 
      { id: 'novo_anuncio', label: 'Novo Anúncio', icon: Megaphone, primary: true } 
    ]
  },
  visibilidade: {
    tabs: [ 
      { id: 'seo', label: 'SEO' }, 
      { id: 'redes_sociais', label: 'Redes Sociais' }, 
      { id: 'backlinks', label: 'Backlinks' }, 
      { id: 'performance', label: 'Performance' } 
    ],
    actions: [ 
      { id: 'analisar_url', label: 'Analisar URL', icon: Search }, 
      { id: 'auditoria', label: 'Auditoria de SEO', icon: ListTodo } 
    ]
  },
  links_sidebar: {
    tabs: [ 
      { id: 'ativos', label: 'Links Ativos' }, 
      { id: 'inativos', label: 'Links Inativos' }, 
      { id: 'grupos', label: 'Grupos de Links' } 
    ],
    actions: [ 
      { id: 'reordenar', label: 'Reordenar Links', icon: Rows }, 
      { id: 'novo_link', label: 'Novo Link', icon: LinkIcon, primary: true } 
    ]
  },
  cabecalho: {
    tabs: [ 
      { id: 'menu_principal', label: 'Menu Principal' }, 
      { id: 'submenus', label: 'Submenus' }, 
      { id: 'contato', label: 'Itens de Contato' } 
    ],
    actions: [ 
      { id: 'gerenciar_menus', label: 'Gerenciar Menus', icon: Settings }, 
      { id: 'salvar', label: 'Salvar Alterações', icon: Save, primary: true } 
    ]
  },
  permissoes: {
    tabs: [ 
      { id: 'cargos', label: 'Todos os Cargos' }, 
      { id: 'admins', label: 'Administradores' }, 
      { id: 'editores', label: 'Editores' }, 
      { id: 'suporte', label: 'Suporte' } 
    ],
    actions: [ 
      { id: 'auditoria', label: 'Auditoria de Logs', icon: ListTodo }, 
      { id: 'novo_cargo', label: 'Novo Cargo', icon: ShieldCheck, primary: true } 
    ]
  },
  diagnosticos: {
    tabs: [ 
      { id: 'geral', label: 'Geral' }, 
      { id: 'banco_dados', label: 'Banco de Dados' }, 
      { id: 'api', label: 'API' }, 
      { id: 'servicos', label: 'Serviços Externos' } 
    ],
    actions: [ 
      { id: 'exportar', label: 'Exportar Relatório', icon: FileText }, 
      { id: 'executar', label: 'Executar Novo Diagnóstico', icon: BarChart2, primary: true } 
    ]
  },
  minha_conta: {
    tabs: [ 
      { id: 'perfil', label: 'Perfil' }, 
      { id: 'seguranca', label: 'Segurança' }, 
      { id: 'preferencias', label: 'Preferências' }, 
      { id: 'faturamento', label: 'Faturamento' } 
    ],
    actions: [ 
      { id: 'alterar_senha', label: 'Alterar Senha', icon: Key }, 
      { id: 'salvar', label: 'Salvar Alterações', icon: Save, primary: true } 
    ]
  }
};

type ActiveSection = keyof typeof topbarConfig;

// --- SUB-COMPONENTE: Sidebar ---
const Sidebar: FC<{ activeSection: ActiveSection; setActiveSection: (s: ActiveSection) => void; }> = ({ activeSection, setActiveSection }) => {
  const navItems = {
    GERAL: [ 
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' }, 
      { id: 'usuarios', icon: Users, label: 'Usuários' }, 
      { id: 'notificacoes', icon: Bell, label: 'Notificações' }, 
      { id: 'enviar_mensagem', icon: MessageSquare, label: 'Enviar Mensagem' } 
    ],
    WORKSPACE: [ 
      { id: 'ferramentas', icon: Wrench, label: 'Ferramentas' }, 
      { id: 'anuncios', icon: Megaphone, label: 'Anúncios' }, 
      { id: 'visibilidade', icon: Eye, label: 'Visibilidade' }, 
      { id: 'links_sidebar', icon: LinkIcon, label: 'Links da Sidebar' } 
    ],
    CONFIGURAÇÕES: [ 
      { id: 'cabecalho', icon: Settings, label: 'Cabeçalho' }, 
      { id: 'permissoes', icon: ShieldCheck, label: 'Permissões' }, 
      { id: 'diagnosticos', icon: BarChart2, label: 'Diagnósticos' }, 
      { id: 'minha_conta', icon: User, label: 'Minha Conta' } 
    ]
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-neutral-800 bg-[#1C1C1E] p-4 flex-shrink-0">
      <h1 className="text-xl font-bold text-white px-2">Cyrus Admin</h1>
      <nav className="mt-12 flex-1 space-y-4 overflow-y-auto">
        {Object.entries(navItems).map(([group, items]) => (
          <div key={group}>
            <h2 className="px-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">{group}</h2>
            <ul className="mt-2 space-y-1">
              {items.map(item => (
                <li key={item.id}>
                  <a href="#" onClick={e => { e.preventDefault(); setActiveSection(item.id as ActiveSection); }}
                     className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${activeSection === item.id ? 'bg-[#8A2BE2] text-white' : 'text-neutral-300 hover:bg-neutral-700/50'}`}>
                    <item.icon className="h-5 w-5" /><span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

// --- SUB-COMPONENTE: Topbar ---
const Topbar: FC<{ activeSection: ActiveSection; }> = ({ activeSection }) => {
    const config = topbarConfig[activeSection] || topbarConfig.dashboard;
    const [activeTabId, setActiveTabId] = useState(config.tabs[0]?.id);
  
    useEffect(() => { 
      setActiveTabId(topbarConfig[activeSection]?.tabs[0]?.id); 
    }, [activeSection]);
  
    return (
      <header className="flex h-16 w-full flex-shrink-0 items-center justify-between border-b border-neutral-800 bg-[#1C1C1E] px-8 text-sm font-medium">
        <div className="flex items-center gap-6 text-neutral-400">
          {config.tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTabId(tab.id)}
                    className={`relative whitespace-nowrap transition-colors hover:text-white ${activeTabId === tab.id ? 'text-white font-semibold' : ''}`}>
              {tab.label}
              {activeTabId === tab.id && <div className="absolute -bottom-5 left-0 h-[2px] w-full bg-[#8A2BE2] rounded-full"></div>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-5">
          {config.actions.map((action: any) => (
            <button key={action.id}
                    className={`flex items-center gap-2 whitespace-nowrap transition-colors ${action.primary ? 'h-9 rounded-md bg-[#8A2BE2] px-4 text-white hover:bg-purple-700' : 'text-neutral-400 hover:text-white'}`}>
              {action.icon && <action.icon className="h-4 w-4" />}<span>{action.label}</span>
            </button>
          ))}
          <div className="relative ml-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input type="text" placeholder="Buscar..." className="h-9 w-48 rounded-md border border-neutral-700 bg-transparent py-1.5 pl-9 pr-3 text-sm text-white placeholder-neutral-500" />
          </div>
        </div>
      </header>
    );
  };

// --- COMPONENTE PRINCIPAL (PROTÓTIPO VISUAL COMPLETO) ---
export function CyrusAdminFullPrototype() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');

  return (
    <div className="flex h-screen w-full bg-[#1e1e1e] font-sans">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 flex flex-col min-w-0">
        <Topbar activeSection={activeSection} />
        <div className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-2xl font-bold capitalize text-white">Página: {activeSection.replace(/_/g, ' ')}</h1>
          <p className="text-neutral-400 mt-2">O conteúdo visual desta página seria renderizado aqui.</p>
          
          {/* Demonstração visual das abas ativas */}
          <div className="mt-6 p-4 bg-neutral-800/50 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Configuração da Topbar Atual:</h3>
            <div className="space-y-2">
              <p className="text-neutral-300">
                <span className="font-medium">Abas:</span> {topbarConfig[activeSection]?.tabs.map(tab => tab.label).join(', ')}
              </p>
              <p className="text-neutral-300">
                <span className="font-medium">Ações:</span> {topbarConfig[activeSection]?.actions.map(action => action.label).join(', ')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}