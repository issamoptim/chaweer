import { AppError } from '../../core/errors';
import { ErrorCodes, type ErrorCode } from './error-codes';

export class ValidationError extends AppError {
  public readonly errorCode: ErrorCode;
  public readonly details?: Array<{ field: string; message: string }>;

  constructor(message: string, details?: Array<{ field: string; message: string }>) {
    super(message, 422);
    this.errorCode = ErrorCodes.VALIDATION_ERROR;
    this.details = details;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class InvalidCredentialsError extends AppError {
  public readonly errorCode: ErrorCode;

  constructor(message = 'Email ou mot de passe incorrect.') {
    super(message, 401);
    this.errorCode = ErrorCodes.INVALID_CREDENTIALS;
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}

export class EmailAlreadyExistsError extends AppError {
  public readonly errorCode: ErrorCode;

  constructor(message = 'Cette adresse e-mail est déjà utilisée.') {
    super(message, 409);
    this.errorCode = ErrorCodes.EMAIL_ALREADY_EXISTS;
    Object.setPrototypeOf(this, EmailAlreadyExistsError.prototype);
  }
}

export class EmailNotVerifiedError extends AppError {
  public readonly errorCode: ErrorCode;

  constructor(message = "Votre adresse e-mail n'a pas encore été vérifiée.") {
    super(message, 403);
    this.errorCode = ErrorCodes.EMAIL_NOT_VERIFIED;
    Object.setPrototypeOf(this, EmailNotVerifiedError.prototype);
  }
}

export class AccountSuspendedError extends AppError {
  public readonly errorCode: ErrorCode;

  constructor(message = 'Votre compte est suspendu. Veuillez contacter le support.') {
    super(message, 403);
    this.errorCode = ErrorCodes.ACCOUNT_SUSPENDED;
    Object.setPrototypeOf(this, AccountSuspendedError.prototype);
  }
}

export class InvalidRefreshTokenError extends AppError {
  public readonly errorCode: ErrorCode;

  constructor(message = 'Refresh token invalide ou expiré.') {
    super(message, 401);
    this.errorCode = ErrorCodes.INVALID_REFRESH_TOKEN;
    Object.setPrototypeOf(this, InvalidRefreshTokenError.prototype);
  }
}

export class TokenExpiredError extends AppError {
  public readonly errorCode: ErrorCode;

  constructor(message = 'Le token a expiré.') {
    super(message, 401);
    this.errorCode = ErrorCodes.TOKEN_EXPIRED;
    Object.setPrototypeOf(this, TokenExpiredError.prototype);
  }
}

export class UnauthorizedError extends AppError {
  public readonly errorCode: ErrorCode;

  constructor(message = 'Accès non autorisé.') {
    super(message, 401);
    this.errorCode = ErrorCodes.UNAUTHORIZED;
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends AppError {
  public readonly errorCode: ErrorCode;

  constructor(message = 'Accès interdit.') {
    super(message, 403);
    this.errorCode = ErrorCodes.FORBIDDEN;
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class GoogleAuthFailedError extends AppError {
  public readonly errorCode: ErrorCode;

  constructor(message = "Échec de l'authentification Google.") {
    super(message, 401);
    this.errorCode = ErrorCodes.GOOGLE_AUTH_FAILED;
    Object.setPrototypeOf(this, GoogleAuthFailedError.prototype);
  }
}

export class InvalidGoogleTokenError extends AppError {
  public readonly errorCode: ErrorCode;

  constructor(message = 'Token Google invalide.') {
    super(message, 401);
    this.errorCode = ErrorCodes.INVALID_GOOGLE_TOKEN;
    Object.setPrototypeOf(this, InvalidGoogleTokenError.prototype);
  }
}

export class ProviderMismatchError extends AppError {
  public readonly errorCode: ErrorCode;

  constructor(
    message = 'Cette adresse e-mail est déjà utilisée avec une autre méthode de connexion.',
  ) {
    super(message, 409);
    this.errorCode = ErrorCodes.PROVIDER_MISMATCH;
    Object.setPrototypeOf(this, ProviderMismatchError.prototype);
  }
}

export class GoogleAccountAlreadyLinkedError extends AppError {
  public readonly errorCode: ErrorCode;

  constructor(message = 'Ce compte Google est déjà associé à un autre utilisateur.') {
    super(message, 409);
    this.errorCode = ErrorCodes.GOOGLE_ACCOUNT_ALREADY_LINKED;
    Object.setPrototypeOf(this, GoogleAccountAlreadyLinkedError.prototype);
  }
}

export class GoogleAccountNotVerifiedError extends AppError {
  public readonly errorCode: ErrorCode;

  constructor(message = "Votre compte Google n'est pas vérifié.") {
    super(message, 403);
    this.errorCode = ErrorCodes.GOOGLE_ACCOUNT_NOT_VERIFIED;
    Object.setPrototypeOf(this, GoogleAccountNotVerifiedError.prototype);
  }
}

export class InvalidGoogleIdentityError extends AppError {
  public readonly errorCode: ErrorCode;

  constructor(message = 'Identité Google invalide.') {
    super(message, 401);
    this.errorCode = ErrorCodes.INVALID_GOOGLE_IDENTITY;
    Object.setPrototypeOf(this, InvalidGoogleIdentityError.prototype);
  }
}

export class AccountDeletedError extends AppError {
  public readonly errorCode: ErrorCode;

  constructor(message = 'Ce compte a été supprimé. Souhaitez-vous le recréer ?') {
    super(message, 403);
    this.errorCode = ErrorCodes.ACCOUNT_DELETED;
    Object.setPrototypeOf(this, AccountDeletedError.prototype);
  }
}
