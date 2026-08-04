export type AuthenticationErrorCode = 'invalid-credentials' | 'unreachable' | 'unknown';

export class AuthenticationError extends Error {
  constructor(readonly code: AuthenticationErrorCode) {
    super(code);
    this.name = 'AuthenticationError';
  }
}
