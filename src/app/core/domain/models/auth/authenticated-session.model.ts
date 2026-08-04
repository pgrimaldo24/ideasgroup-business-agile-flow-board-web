export interface AuthenticatedSession {
  readonly token: string;
  readonly expiresAtUtc: Date;
  readonly fullName: string;
  readonly email: string;
}
