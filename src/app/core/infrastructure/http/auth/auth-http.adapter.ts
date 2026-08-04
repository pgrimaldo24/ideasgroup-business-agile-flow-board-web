import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

import { AuthPort } from '@core/application/ports/auth/auth.port';
import { AuthenticatedSession } from '@core/domain/models/auth/authenticated-session.model';
import {
  AuthenticationError,
  AuthenticationErrorCode
} from '@core/domain/models/auth/authentication-error.model';
import { Credentials } from '@core/domain/models/auth/credentials.model';
import { ApiClient } from '@core/infrastructure/http/api-client.service';

import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { toAuthenticatedSession } from './mappers/authenticated-session.mapper';

@Injectable()
export class AuthHttpAdapter implements AuthPort {
  private readonly api = inject(ApiClient);

  login(credentials: Credentials): Observable<AuthenticatedSession> {
    const body: LoginRequestDto = {
      email: credentials.email,
      password: credentials.password
    };

    return this.api.post<LoginResponseDto, LoginRequestDto>('auth/login', body).pipe(
      map(toAuthenticatedSession),
      catchError((error: HttpErrorResponse) =>
        throwError(() => new AuthenticationError(this.toErrorCode(error)))
      )
    );
  }

  private toErrorCode(error: HttpErrorResponse): AuthenticationErrorCode {
    if (error.status === 0) {
      return 'unreachable';
    }

    if (error.status === 401) {
      return 'invalid-credentials';
    }

    return 'unknown';
  }
}
