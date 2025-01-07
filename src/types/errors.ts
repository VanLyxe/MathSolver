export class TokenError extends Error {
  constructor(
    public code: 'FETCH_ERROR' | 'UPDATE_ERROR' | 'NO_TOKENS' | 'UNKNOWN_ERROR',
    message: string
  ) {
    super(message);
    this.name = 'TokenError';
  }
}

export class SolverError extends Error {
  constructor(
    public code: 'TOKEN_ERROR' | 'API_ERROR' | 'STORAGE_ERROR' | 'UNKNOWN_ERROR',
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'SolverError';
  }
}