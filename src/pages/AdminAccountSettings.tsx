import React, { useState } from 'react';
import { User, Shield, Palette, Sun, Moon, Monitor } from 'lucide-react';

// Reusable card component for settings sections
const SettingsCard = ({ 
  title, 
  description, 
  children 
}: { 
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="bg-[hsl(var(--admin-card))] p-6 rounded-lg border border-[hsl(var(--admin-border-subtle))] hover:border-[hsl(var(--admin-border))] transition-colors">
    <h2 className="text-lg font-semibold text-[hsl(var(--admin-text))] mb-2">{title}</h2>
    <p className="text-sm text-[hsl(var(--admin-text-muted))] mb-6">{description}</p>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

// Reusable input component for profile information
const SettingsInput = ({ 
  label, 
  value, 
  icon: Icon 
}: { 
  label: string;
  value: string;
  icon: React.ElementType;
}) => (
  <div>
    <label className="text-xs text-[hsl(var(--admin-text-muted))] mb-1 block font-medium">
      {label}
    </label>
    <div className="flex items-center gap-3 p-3 bg-[hsl(var(--admin-background))] rounded-md border border-[hsl(var(--admin-border-subtle))] hover:border-[hsl(var(--admin-border))] transition-colors">
      <Icon className="h-4 w-4 text-[hsl(var(--admin-text-muted))]" />
      <span className="text-[hsl(var(--admin-text))] text-sm">{value}</span>
    </div>
  </div>
);

// Theme selection component
const ThemeOption = ({ 
  name, 
  icon: Icon, 
  isSelected, 
  onClick 
}: {
  name: string;
  icon: React.ElementType;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`border-2 rounded-lg p-4 text-center transition-colors ${
      isSelected
        ? 'border-[hsl(var(--admin-accent))] bg-[hsl(var(--admin-accent))]/10'
        : 'border-[hsl(var(--admin-border))] hover:border-[hsl(var(--admin-accent))]/50'
    }`}
  >
    <Icon 
      className={`mx-auto h-8 w-8 mb-2 ${
        isSelected 
          ? 'text-[hsl(var(--admin-accent))]' 
          : 'text-[hsl(var(--admin-text-muted))]'
      }`} 
    />
    <span 
      className={`font-semibold ${
        isSelected 
          ? 'text-[hsl(var(--admin-accent))]' 
          : 'text-[hsl(var(--admin-text-muted))]'
      }`}
    >
      {name}
    </span>
  </button>
);

const AdminAccountSettings = () => {
  const [selectedTheme, setSelectedTheme] = useState('light');

  const themes = [
    { id: 'light', name: 'Claro', icon: Sun },
    { id: 'dark', name: 'Escuro', icon: Moon },
    { id: 'system', name: 'Sistema', icon: Monitor }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[hsl(var(--admin-text))] mb-2">
          Minha Conta
        </h1>
        <p className="text-[hsl(var(--admin-text-muted))]">
          Gerencie as informações da sua conta e configurações do sistema.
        </p>
      </div>

      {/* Profile Section */}
      <SettingsCard 
        title="Perfil" 
        description="Informações pessoais e de contato do administrador."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingsInput label="Nome completo" value="Admin Master" icon={User} />
          <SettingsInput label="Email" value="admin@cyrus.com" icon={User} />
        </div>
      </SettingsCard>

      {/* Security Section */}
      <SettingsCard 
        title="Segurança" 
        description="Configure a segurança e autenticação da sua conta administrativa."
      >
        <div className="space-y-3">
          <div className="p-4 border border-[hsl(var(--admin-border-subtle))] rounded-lg hover:border-[hsl(var(--admin-accent))]/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-[hsl(var(--admin-accent))]" />
              <div>
                <h3 className="font-semibold text-[hsl(var(--admin-text))]">
                  Autenticação de Dois Fatores (2FA)
                </h3>
                <p className="text-sm text-[hsl(var(--admin-text-muted))]">
                  Proteja sua conta administrativa com uma camada extra de segurança.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-[hsl(var(--admin-border-subtle))] rounded-lg hover:border-[hsl(var(--admin-accent))]/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-[hsl(var(--admin-accent))]" />
              <div>
                <h3 className="font-semibold text-[hsl(var(--admin-text))]">
                  Alterar Senha
                </h3>
                <p className="text-sm text-[hsl(var(--admin-text-muted))]">
                  Recomenda-se usar uma senha forte e única para acesso administrativo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SettingsCard>
      
      {/* Appearance Section */}
      <SettingsCard 
        title="Aparência" 
        description="Customize a aparência do painel administrativo para melhor experiência."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <ThemeOption
              key={theme.id}
              name={theme.name}
              icon={theme.icon}
              isSelected={selectedTheme === theme.id}
              onClick={() => setSelectedTheme(theme.id)}
            />
          ))}
        </div>
      </SettingsCard>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button className="bg-[hsl(var(--admin-accent))] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[hsl(var(--admin-accent-hover))] transition-colors">
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default AdminAccountSettings;