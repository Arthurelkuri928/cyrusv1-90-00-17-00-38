import { supabase } from '@/integrations/supabase/client';
import { ErrorService } from './ErrorService';
import { NetworkError, AppError } from '../errors/AppError';

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

// NOTA: Este serviço está preparado para integração futura com Supabase
// Atualmente isolado para não afetar o build atual do projeto
export class SupabaseService {
  private static instance: SupabaseService;
  private isConnected: boolean = false; // Desabilitado por padrão
  private isEnabled: boolean = false; // Feature flag
  private retryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000
  };
  private errorService = ErrorService.getInstance();

  static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  constructor() {
    console.log('SupabaseService initialized - Integration disabled by default');
  }

  // Método para ativar integração no futuro
  enableIntegration(): void {
    this.isEnabled = true;
    console.log('Supabase integration enabled');
  }

  // Método para obter cliente Supabase (apenas quando ativado)
  getClient() {
    if (!this.isEnabled) {
      throw new Error('Supabase integration is not enabled');
    }
    return supabase;
  }

  async executeQuery<T>(
    queryFn: () => Promise<{ data: T; error: any }>,
    context?: Record<string, any>
  ): Promise<T> {
    if (!this.isEnabled) {
      throw new Error('Supabase integration is not enabled');
    }

    return this.withRetry(async () => {
      try {
        const { data, error } = await queryFn();
        
        if (error) {
          throw new AppError(error.message, error.code || 500, true, {
            ...context,
            supabaseError: error
          });
        }

        this.isConnected = true;
        return data;
      } catch (error) {
        this.handleConnectionError(error);
        throw error;
      }
    }, context);
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (!this.shouldRetry(error, attempt)) {
          break;
        }

        const delay = this.calculateDelay(attempt);
        console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error);
        
        await this.sleep(delay);
      }
    }

    this.errorService.handleError(lastError!, {
      ...context,
      attemptsExhausted: this.retryConfig.maxRetries
    });
    
    throw lastError!;
  }

  private shouldRetry(error: unknown, attempt: number): boolean {
    if (attempt >= this.retryConfig.maxRetries) {
      return false;
    }

    // Don't retry client errors (4xx)
    if (error instanceof AppError && error.statusCode >= 400 && error.statusCode < 500) {
      return false;
    }

    // Retry network errors and server errors
    return true;
  }

  private calculateDelay(attempt: number): number {
    const exponentialDelay = this.retryConfig.baseDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 0.1 * exponentialDelay; // Add 10% jitter
    
    return Math.min(exponentialDelay + jitter, this.retryConfig.maxDelay);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleConnectionError(error: unknown): void {
    if (this.isNetworkError(error)) {
      this.isConnected = false;
      console.warn('Supabase connection lost, entering offline mode');
    }
  }

  private isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message.includes('fetch') || 
             error.message.includes('network') ||
             error.message.includes('offline');
    }
    return false;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.isEnabled) {
      console.log('Supabase health check skipped - integration disabled');
      return false;
    }

    try {
      const { error } = await supabase.from('tools').select('count').limit(1);
      this.isConnected = !error;
      return this.isConnected;
    } catch {
      this.isConnected = false;
      return false;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected && this.isEnabled;
  }

  getIntegrationStatus(): boolean {
    return this.isEnabled;
  }
}
