import { AuthenticatedSession } from '@core/domain/models/auth/authenticated-session.model';

import { LoginResponseDto } from '../dto/login-response.dto';

export function toAuthenticatedSession(dto: LoginResponseDto): AuthenticatedSession {
  return {
    token: dto.token,
    expiresAtUtc: new Date(dto.expiresAtUtc),
    fullName: dto.fullName,
    email: dto.email
  };
}
