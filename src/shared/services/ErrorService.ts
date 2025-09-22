import { toast } from 'sonner';
import { AppError } from '../errors/AppError';

export class ErrorService {
  private static instance: ErrorService;
  private errorQueue: AppError[] = [];

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  handleError(error: unknown, context?: Record<string, any>): void {
    console.error('Error caught by ErrorService:', error, context);

    const appError = this.normalizeError(error, context);
    this.logError(appError);
    this.showUserFriendlyMessage(appError);
    
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(appError);
    }
  }

  private normalizeError(error: unknown, context?: Record<string, any>): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError(error.message, 500, true, { 
        ...context, 
        originalStack: error.stack 
      });
    }

    return new AppError(
      'Erro inesperado',
      500,
      true,
      { ...context, originalError: String(error) }
    );
  }

  private logError(error: AppError): void {
    this.errorQueue.push(error);
    
    // Keep only last 50 errors in memory
    if (this.errorQueue.length > 50) {
      this.errorQueue = this.errorQueue.slice(-50);
    }
  }

  private showUserFriendlyMessage(error: AppError): void {
    const userMessage = this.getUserFriendlyMessage(error);
    
    if (error.statusCode >= 500) {
      toast.error(userMessage);
    } else if (error.statusCode >= 400) {
      toast.warning(userMessage);
    } else {
      toast.info(userMessage);
    }
  }

  private getUserFriendlyMessage(error: AppError): string {
    switch (error.statusCode) {
      case 401:
        return 'Sessão expirada. Faça login novamente.';
      case 403:
        return 'Você não tem permissão para esta ação.';
      case 404:
        return 'Recurso não encontrado.';
      case 429:
        return 'Muitas tentativas. Tente novamente em alguns minutos.';
      case 503:
        return 'Serviço temporariamente indisponível. Tente novamente.';
      default:
        return error.message || 'Algo deu errado. Tente novamente.';
    }
  }

  private sendToMonitoring(error: AppError): void {
    // Placeholder for monitoring service integration
    // Could be Sentry, LogRocket, etc.
    console.info('Would send to monitoring:', error);
  }

  getErrorHistory(): AppError[] {
    return [...this.errorQueue];
  }

  clearErrorHistory(): void {
    this.errorQueue = [];
  }
}
