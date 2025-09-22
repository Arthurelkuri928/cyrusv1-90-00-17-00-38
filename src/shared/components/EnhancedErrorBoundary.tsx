
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ErrorService } from '../services/ErrorService';
import { AppError } from '../errors/AppError';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  private errorService = ErrorService.getInstance();

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError = new AppError(
      error.message,
      500,
      true,
      {
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      }
    );

    this.errorService.handleError(appError);
    this.props.onError?.(error, errorInfo);
    
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReportError = () => {
    if (this.state.error && this.state.errorId) {
      // In production, this would send to error reporting service
      console.log('Reporting error:', {
        errorId: this.state.errorId,
        error: this.state.error,
        errorInfo: this.state.errorInfo,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
      
      alert(`Erro reportado com ID: ${this.state.errorId}`);
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-md w-full space-y-4">
            <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-red-800 dark:text-red-200">
                Ops! Algo deu errado
              </AlertTitle>
              <AlertDescription className="mt-2 text-red-700 dark:text-red-300">
                Ocorreu um erro inesperado na aplicação. Nossa equipe foi notificada 
                e está trabalhando para resolver o problema.
              </AlertDescription>
            </Alert>

            {this.state.errorId && (
              <div className="text-xs text-gray-500 dark:text-gray-400 font-mono p-2 bg-gray-100 dark:bg-gray-800 rounded">
                ID do Erro: {this.state.errorId}
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <Button onClick={this.handleRetry} variant="outline" size="sm" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
              
              <Button onClick={this.handleReload} size="sm" className="w-full">
                Recarregar Página
              </Button>

              <Button 
                onClick={this.handleReportError} 
                variant="ghost" 
                size="sm" 
                className="w-full text-gray-600 dark:text-gray-400"
              >
                <Bug className="h-4 w-4 mr-2" />
                Reportar Erro
              </Button>
            </div>
            
            {(process.env.NODE_ENV === 'development' || this.props.showErrorDetails) && this.state.error && (
              <details className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                <summary className="cursor-pointer font-medium mb-2">
                  Detalhes Técnicos (Dev Mode)
                </summary>
                <div className="space-y-2">
                  <div>
                    <strong>Erro:</strong>
                    <pre className="mt-1 whitespace-pre-wrap text-red-600 dark:text-red-400 text-xs">
                      {this.state.error.message}
                    </pre>
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="mt-1 whitespace-pre-wrap text-gray-600 dark:text-gray-400 text-xs max-h-32 overflow-auto">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 whitespace-pre-wrap text-gray-600 dark:text-gray-400 text-xs max-h-32 overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
