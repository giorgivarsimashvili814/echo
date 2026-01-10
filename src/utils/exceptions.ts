export class HttpException extends Error {
  constructor(public status: number, message: string) {
    super(message);
    Object.setPrototypeOf(this, HttpException.prototype);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string = "Bad Request") {
    super(400, message);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = "Unauthorized") {
    super(401, message);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = "Forbidden") {
    super(403, message);
  }
}

export class ConflictException extends HttpException {
  constructor(message: string = "Conflict") {
    super(409, message);
  }
}
