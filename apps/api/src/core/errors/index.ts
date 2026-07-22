export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errorCode?: string;
  public readonly details?: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    errorCode?: string,
    details?: Array<{ field: string; message: string }>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorCode = errorCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, true, 'NOT_FOUND');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Raised when a professional attempts to publish a profile that does not
 * satisfy all mandatory publication requirements. Returns HTTP 422 with the
 * structured list of missing requirements.
 */
export class PublicationRequirementsError extends AppError {
  public readonly missingRequirements: string[];

  constructor(missingRequirements: string[]) {
    super(
      'Le profil ne remplit pas tous les critères de publication.',
      422,
      true,
      'PUBLICATION_REQUIREMENTS_MISSING',
    );
    this.missingRequirements = missingRequirements;
    Object.setPrototypeOf(this, PublicationRequirementsError.prototype);
  }
}
