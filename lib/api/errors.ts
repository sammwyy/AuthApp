export class HTTPError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message,
    };
  }
}

export class BadRequestError extends HTTPError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends HTTPError {
  constructor(message: string) {
    super(401, message);
  }
}

export class ForbiddenError extends HTTPError {
  constructor(message: string) {
    super(403, message);
  }
}

export class NotFoundError extends HTTPError {
  constructor(message: string) {
    super(404, message);
  }
}

export class MethodNotAllowedError extends HTTPError {
  constructor(message: string) {
    super(405, message);
  }
}

export class ConflictError extends HTTPError {
  constructor(message: string) {
    super(409, message);
  }
}

export class InternalServerError extends HTTPError {
  constructor(message: string) {
    super(500, message);
  }
}

export class NotImplementedError extends HTTPError {
  constructor(message: string) {
    super(501, message);
  }
}

export class ServiceUnavailableError extends HTTPError {
  constructor(message: string) {
    super(503, message);
  }
}
