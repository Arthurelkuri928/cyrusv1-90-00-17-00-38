
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message);
    
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Erro de conexão', context?: Record<string, any>) {
    super(message, 503, true, context);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Dados inválidos', context?: Record<string, any>) {
    super(message, 400, true, context);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Não autorizado', context?: Record<string, any>) {
    super(message, 401, true, context);
  }
}
