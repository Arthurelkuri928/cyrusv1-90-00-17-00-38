
import { APP_CONFIG } from '@/config/appConfig';

interface DebugLog {
  timestamp: string;
  component: string;
  action: string;
  data?: any;
}

class DebugSystem {
  private logs: DebugLog[] = [];
  private isEnabled: boolean = process.env.NODE_ENV === 'development';

  log(component: string, action: string, data?: any) {
    if (!this.isEnabled) return;

    const logEntry: DebugLog = {
      timestamp: new Date().toISOString(),
      component,
      action,
      data,
    };

    this.logs.push(logEntry);
    console.log(`🔧 [${component}] ${action}`, data || '');

    // Manter apenas os últimos 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }
  }

  logNavbarResize(width: number, component: string) {
    this.log(component, 'NAVBAR_RESIZE', { 
      width, 
      viewport: window.innerWidth,
      expectedWidth: `${APP_CONFIG.NAVBAR.WIDTH_PERCENTAGE}vw`,
    });
  }

  logZIndexConflict(component: string, currentZIndex: number, expectedZIndex: number) {
    this.log(component, 'Z_INDEX_CONFLICT', {
      current: currentZIndex,
      expected: expectedZIndex,
      hierarchy: APP_CONFIG.Z_INDEX,
    });
  }

  logStyleApplication(component: string, styles: any) {
    this.log(component, 'STYLE_APPLICATION', styles);
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
    console.log('🔧 Debug logs cleared');
  }

  enable() {
    this.isEnabled = true;
    console.log('🔧 Debug system enabled');
  }

  disable() {
    this.isEnabled = false;
    console.log('🔧 Debug system disabled');
  }
}

export const debugSystem = new DebugSystem();

// Hook para usar o sistema de debug
export const useDebug = () => ({
  log: debugSystem.log.bind(debugSystem),
  logNavbarResize: debugSystem.logNavbarResize.bind(debugSystem),
  logZIndexConflict: debugSystem.logZIndexConflict.bind(debugSystem),
  logStyleApplication: debugSystem.logStyleApplication.bind(debugSystem),
  getLogs: debugSystem.getLogs.bind(debugSystem),
  clearLogs: debugSystem.clearLogs.bind(debugSystem),
  enable: debugSystem.enable.bind(debugSystem),
  disable: debugSystem.disable.bind(debugSystem),
});

// Função global para acessar o debug no console
if (typeof window !== 'undefined') {
  (window as any).CyrusDebug = debugSystem;
}
