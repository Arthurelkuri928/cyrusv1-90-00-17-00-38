import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SettingsSwitch } from "@/components/ui/SettingsSwitch";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SettingsKeyboardShortcuts } from "@/components/ui/SettingsKeyboardShortcuts";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "@/app/store/ui.store";
import ModernSidebar from "@/components/member/ModernSidebar";
import Loader from "@/components/ui/loader";
import { Settings, Bell, Moon, Sun, Globe, Monitor, Save, Palette, Languages, Layout, Keyboard } from "lucide-react";

const ConfiguracoesPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  
  // UI Store para controle do sidebar
  const { setManualSidebarControl } = useUIStore();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Estado das configurações pendentes (alterações temporárias)
  const [pendingSettings, setPendingSettings] = useState({
    theme: 'dark' as 'light' | 'dark',
    language: 'pt-BR' as 'pt-BR' | 'en-US' | 'es-ES',
    notifications: {
      email: true,
      push: false,
      updates: true,
      marketing: false
    },
    autoPlay: true,
    layout: {
      customLayout: false,
      restoreDefault: false,
      manualSidebarControl: false
    }
  });

  // Estado das configurações salvas (estado atual)
  const [savedSettings, setSavedSettings] = useState(pendingSettings);
  const [hasChanges, setHasChanges] = useState(false);

  // Dados do usuário para o sidebar
  const userData = {
    name: user?.user_metadata?.username || localStorage.getItem("username") || "Usuário Premium",
    avatar: localStorage.getItem("selectedAvatar") || "https://cdn-icons-png.flaticon.com/128/7790/7790136.png"
  };

  // Inicialização das configurações - APENAS UMA VEZ
  useEffect(() => {
    if (!isInitialized) {
      console.log('🔧 ConfiguracoesPage: Inicializando configurações da página de configurações');
      
      const storedSettings = localStorage.getItem('userSettings');
      const parsedSettings = storedSettings ? JSON.parse(storedSettings) : {};
      
      const initialSettings = {
        theme: theme, // Usa o tema atual do contexto
        language: language, // Usa o idioma atual do contexto
        notifications: parsedSettings.notifications || {
          email: true,
          push: false,
          updates: true,
          marketing: false
        },
        autoPlay: parsedSettings.autoPlay !== undefined ? parsedSettings.autoPlay : true,
        layout: parsedSettings.layout || {
          customLayout: false,
          restoreDefault: false,
          manualSidebarControl: false
        }
      };

      console.log('🔧 ConfiguracoesPage: Configurações iniciais carregadas:', initialSettings);
      
      setSavedSettings(initialSettings);
      setPendingSettings(initialSettings);
      setIsInitialized(true);
    }
  }, [theme, language, isInitialized]);

  // Função para detectar mudanças
  const detectChanges = useCallback((newSettings: typeof pendingSettings) => {
    const hasThemeChange = newSettings.theme !== savedSettings.theme;
    const hasLanguageChange = newSettings.language !== savedSettings.language;
    const hasNotificationChanges = JSON.stringify(newSettings.notifications) !== JSON.stringify(savedSettings.notifications);
    const hasAutoPlayChange = newSettings.autoPlay !== savedSettings.autoPlay;
    const hasLayoutChanges = JSON.stringify(newSettings.layout) !== JSON.stringify(savedSettings.layout);
    
    const result = hasThemeChange || hasLanguageChange || hasNotificationChanges || hasAutoPlayChange || hasLayoutChanges;
    
    console.log('🔧 ConfiguracoesPage: Detectando mudanças:', {
      hasThemeChange,
      hasLanguageChange,
      hasNotificationChanges,
      hasAutoPlayChange,
      hasLayoutChanges,
      result,
      newTheme: newSettings.theme,
      savedTheme: savedSettings.theme
    });
    
    return result;
  }, [savedSettings]);

  // Função para atualizar configurações pendentes - SEM aplicar tema imediatamente
  const updatePendingSettings = useCallback((category: string, setting: string, value: boolean | string) => {
    console.log('🔧 ConfiguracoesPage: Atualizando configuração pendente:', { category, setting, value });
    
    setPendingSettings(prev => {
      let newSettings = { ...prev };
      
      if (category === 'theme') {
        newSettings.theme = value as 'light' | 'dark';
        // NÃO aplicar tema temporariamente - apenas manter no estado local
      } else if (category === 'language') {
        newSettings.language = value as 'pt-BR' | 'en-US' | 'es-ES';
        // NÃO aplicar idioma temporariamente - apenas manter no estado local
      } else if (category === 'notifications') {
        newSettings.notifications = {
          ...prev.notifications,
          [setting]: value
        };
      } else if (category === 'layout') {
        newSettings.layout = {
          ...prev.layout,
          [setting]: value
        };
      } else {
        (newSettings as any)[setting] = value;
      }
      
      // Detectar mudanças de forma assíncrona
      setTimeout(() => {
        const hasChangesDetected = detectChanges(newSettings);
        setHasChanges(hasChangesDetected);
      }, 0);
      
      return newSettings;
    });
  }, [detectChanges]);

  const handleThemeChange = useCallback((newTheme: 'light' | 'dark' | 'auto') => {
    if (newTheme !== 'auto') {
      console.log('🔧 ConfiguracoesPage: Alterando seleção de tema pendente para:', newTheme);
      updatePendingSettings('theme', '', newTheme);
    }
  }, [updatePendingSettings]);

  const handleLanguageChange = useCallback((newLanguage: 'pt-BR' | 'en-US' | 'es-ES') => {
    console.log('🔧 ConfiguracoesPage: Alterando seleção de idioma pendente para:', newLanguage);
    updatePendingSettings('language', '', newLanguage);
  }, [updatePendingSettings]);

  const saveSettings = async () => {
    console.log('🔧 ConfiguracoesPage: === INICIANDO SALVAMENTO ===');
    console.log('🔧 ConfiguracoesPage: Configurações pendentes:', pendingSettings);
    console.log('🔧 ConfiguracoesPage: Configurações salvas atuais:', savedSettings);
    
    setIsSaving(true);

    try {
      // Simular tempo de processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('🔧 ConfiguracoesPage: Aplicando configurações permanentemente...');
      
      // AGORA aplicar configurações de tema e idioma PERMANENTEMENTE
      console.log('🔧 ConfiguracoesPage: Salvando tema:', pendingSettings.theme);
      setTheme(pendingSettings.theme); // Esta função já salva no localStorage
      
      console.log('🔧 ConfiguracoesPage: Salvando idioma:', pendingSettings.language);
      setLanguage(pendingSettings.language); // Esta função já salva no localStorage
      
      // 🔧 CORREÇÃO: Aplicar manualSidebarControl IMEDIATAMENTE
      const oldManualControl = savedSettings.layout.manualSidebarControl;
      const newManualControl = pendingSettings.layout.manualSidebarControl;
      
      if (oldManualControl !== newManualControl) {
        console.log('🔧 ConfiguracoesPage: === APLICANDO CONTROLE MANUAL ===');
        console.log('🔧 ConfiguracoesPage: Valor anterior:', oldManualControl);
        console.log('🔧 ConfiguracoesPage: Novo valor:', newManualControl);
        
        // Aplicar na UI Store IMEDIATAMENTE
        setManualSidebarControl(newManualControl);
        
        // Aguardar um momento para a UI Store processar
        await new Promise(resolve => setTimeout(resolve, 200));
        
        console.log('🔧 ConfiguracoesPage: manualSidebarControl aplicado na UI Store');
      }
      
      // Atualizar configurações salvas com as pendentes
      const newSavedSettings = { ...pendingSettings };
      setSavedSettings(newSavedSettings);
      
      // Salvar outras configurações no localStorage
      const settingsToSave = {
        notifications: pendingSettings.notifications,
        autoPlay: pendingSettings.autoPlay,
        layout: pendingSettings.layout
      };
      
      localStorage.setItem('userSettings', JSON.stringify(settingsToSave));
      setHasChanges(false);

      console.log('🔧 ConfiguracoesPage: === CONFIGURAÇÕES SALVAS COM SUCESSO ===');
      console.log('🔧 ConfiguracoesPage: Novo estado salvo:', newSavedSettings);

      toast({
        title: t('settingsSaved'),
        description: t('settingsSavedDesc'),
        duration: 3000
      });

      // 🔧 CORREÇÃO: NÃO fazer reload - configurações aplicadas instantaneamente
      console.log('🔧 ConfiguracoesPage: Configurações aplicadas sem reload - usuário mantido logado');
      
    } catch (error) {
      console.error('🔧 ConfiguracoesPage: Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações. Tente novamente.",
        duration: 3000
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileClick = () => {
    navigate("/perfil");
  };

  const themeOptions = [
    {
      value: 'dark',
      label: t('dark'),
      icon: Moon,
      description: t('themeDefault')
    },
    {
      value: 'light',
      label: t('light'),
      icon: Sun,
      description: t('professionalLightMode')
    }
  ];

  const languageOptions = [
    {
      value: 'pt-BR',
      label: 'Português (Brasil)',
      flag: '🇧🇷'
    },
    {
      value: 'en-US',
      label: 'English (US)',
      flag: '🇺🇸'
    },
    {
      value: 'es-ES',
      label: 'Español',
      flag: '🇪🇸'
    }
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Sidebar */}
        <ModernSidebar 
          username={userData.name} 
          selectedAvatar={userData.avatar} 
          onProfileClick={handleProfileClick} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />

        {/* Loading Overlay */}
        {isSaving && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader size="lg" />
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">{t('savingSettings')}</h3>
                <p className="text-muted-foreground">{t('savingSettingsDesc')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main content with sidebar spacing */}
        <div className="md:ml-20 transition-all duration-200 ease-out">
          <div className="container max-w-4xl mx-auto px-6 py-8">
            {/* Cabeçalho da página */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-cyrus-primary bg-clip-text text-transparent">
                {t('settings')}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('settingsDescription')}
              </p>
              {hasChanges && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                    ⚠️ Você tem alterações não salvas. Clique em "Salvar Configurações" para aplicá-las permanentemente.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Tema - Card destacado */}
              <Card variant="glass-subtle">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-card-foreground">
                    <Palette className="h-5 w-5 text-cyrus-primary" />
                    {t('appearance')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {themeOptions.map((option) => {
                      const IconComponent = option.icon;
                      // Usar o tema pendente para mostrar a seleção visual
                      const isSelected = pendingSettings.theme === option.value;
                      
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleThemeChange(option.value as 'light' | 'dark')}
                          className={`p-4 rounded-xl border transition-all duration-300 text-left cursor-pointer hover:shadow-md ${
                            isSelected
                              ? 'border-cyrus-primary bg-cyrus-primary/10'
                              : 'border-border bg-card hover:border-border/80'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <IconComponent className={`h-5 w-5 ${isSelected ? 'text-cyrus-primary' : 'text-muted-foreground'}`} />
                            <span className={`font-medium ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>
                              {option.label}
                            </span>
                            {isSelected && (
                              <Badge className="bg-cyrus-primary text-primary-foreground text-xs">
                                {hasChanges && pendingSettings.theme !== savedSettings.theme ? 'Selecionado' : t('active')}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Accordion para seções retráteis */}
              <Accordion type="multiple" className="space-y-4">
                {/* Atalhos do Teclado - Nova seção recolhível SEM bordas */}
                <AccordionItem value="shortcuts" className="glass-card-subtle rounded-xl" hideBorder>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-3 text-card-foreground">
                      <Keyboard className="h-5 w-5 text-cyrus-primary" />
                      <span className="text-lg font-semibold">{t('keyboardShortcuts')}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <SettingsKeyboardShortcuts />
                  </AccordionContent>
                </AccordionItem>

                {/* Idioma e Região SEM bordas */}
                <AccordionItem value="language" className="glass-card-subtle rounded-xl" hideBorder>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-3 text-card-foreground">
                      <Languages className="h-5 w-5 text-cyrus-primary" />
                      <span className="text-lg font-semibold">{t('languageAndRegion')}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {languageOptions.map((option) => {
                        // Usar o idioma pendente para mostrar a seleção visual
                        const isSelected = pendingSettings.language === option.value;
                        
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleLanguageChange(option.value as 'pt-BR' | 'en-US' | 'es-ES')}
                            className={`p-4 rounded-xl border transition-all duration-300 text-left cursor-pointer hover:shadow-md ${
                              isSelected
                                ? 'border-cyrus-primary bg-cyrus-primary/10'
                                : 'border-border bg-card hover:border-border/80'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{option.flag}</span>
                              <div className="flex-1">
                                <span className={`font-medium ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>
                                  {option.label}
                                </span>
                                {isSelected && (
                                  <Badge className="ml-2 bg-cyrus-primary text-primary-foreground text-xs">
                                    {hasChanges && pendingSettings.language !== savedSettings.language ? 'Selecionado' : t('active')}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Notificações SEM bordas */}
                <AccordionItem value="notifications" className="glass-card-subtle rounded-xl" hideBorder>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-3 text-card-foreground">
                      <Bell className="h-5 w-5 text-cyrus-primary" />
                      <span className="text-lg font-semibold">{t('notifications')}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                        <div>
                          <h4 className="font-medium text-foreground">{t('emailNotifications')}</h4>
                          <p className="text-sm text-muted-foreground">{t('emailNotificationsDesc')}</p>
                        </div>
                        <SettingsSwitch 
                          checked={pendingSettings.notifications.email} 
                          onCheckedChange={(checked) => updatePendingSettings('notifications', 'email', checked)} 
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                        <div>
                          <h4 className="font-medium text-foreground">{t('pushNotifications')}</h4>
                          <p className="text-sm text-muted-foreground">{t('pushNotificationsDesc')}</p>
                        </div>
                        <SettingsSwitch 
                          checked={pendingSettings.notifications.push} 
                          onCheckedChange={(checked) => updatePendingSettings('notifications', 'push', checked)} 
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                        <div>
                          <h4 className="font-medium text-foreground">{t('platformUpdates')}</h4>
                          <p className="text-sm text-muted-foreground">{t('platformUpdatesDesc')}</p>
                        </div>
                        <SettingsSwitch 
                          checked={pendingSettings.notifications.updates} 
                          onCheckedChange={(checked) => updatePendingSettings('notifications', 'updates', checked)} 
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                        <div>
                          <h4 className="font-medium text-foreground">{t('offersAndPromotions')}</h4>
                          <p className="text-sm text-muted-foreground">{t('offersAndPromotionsDesc')}</p>
                        </div>
                        <SettingsSwitch 
                          checked={pendingSettings.notifications.marketing} 
                          onCheckedChange={(checked) => updatePendingSettings('notifications', 'marketing', checked)} 
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Layout SEM bordas */}
                <AccordionItem value="layout" className="glass-card-subtle rounded-xl" hideBorder>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-3 text-card-foreground">
                      <Layout className="h-5 w-5 text-cyrus-primary" />
                      <span className="text-lg font-semibold">{t('layout')}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                        <div>
                          <h4 className="font-medium text-foreground">{t('customLayout')}</h4>
                          <p className="text-sm text-muted-foreground">{t('customLayoutDesc')}</p>
                        </div>
                        <SettingsSwitch 
                          checked={pendingSettings.layout.customLayout} 
                          onCheckedChange={(checked) => updatePendingSettings('layout', 'customLayout', checked)} 
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                        <div>
                          <h4 className="font-medium text-foreground">{t('restoreDefaultLayout')}</h4>
                          <p className="text-sm text-muted-foreground">{t('restoreDefaultLayoutDesc')}</p>
                        </div>
                        <SettingsSwitch 
                          checked={pendingSettings.layout.restoreDefault} 
                          onCheckedChange={(checked) => updatePendingSettings('layout', 'restoreDefault', checked)} 
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                        <div>
                          <h4 className="font-medium text-foreground">{t('manualSidebarControl')}</h4>
                          <p className="text-sm text-muted-foreground">{t('manualSidebarControlDesc')}</p>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <SettingsSwitch 
                                checked={pendingSettings.layout.manualSidebarControl} 
                                onCheckedChange={(checked) => updatePendingSettings('layout', 'manualSidebarControl', checked)} 
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="bg-popover border-border text-popover-foreground max-w-xs">
                            {pendingSettings.layout.manualSidebarControl ? (
                              <p className="text-sm whitespace-pre-line">
                                {t('disableSidebarManual')}
                              </p>
                            ) : (
                              <p className="text-sm whitespace-pre-line">
                                {t('enableSidebarManual')}
                              </p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Botão Salvar */}
              <div className="flex justify-end">
                <Button
                  onClick={saveSettings}
                  disabled={!hasChanges || isSaving}
                  className={`flex items-center gap-2 font-medium shadow-lg transition-all duration-300 ${
                    hasChanges && !isSaving
                      ? 'bg-gradient-to-r from-cyrus-primary to-cyrus-blue hover:from-cyrus-primary-light hover:to-cyrus-blue text-primary-foreground hover:shadow-xl'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {isSaving ? (
                    <Loader size="sm" className="w-4 h-4" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isSaving ? t('saving') : t('saveChanges')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ConfiguracoesPage;
