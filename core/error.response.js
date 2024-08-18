'use strict';

const { STATUS_CODE, REASON_PHRASE } = require('../utils/httpStatusCode')

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

// 409 Error
class ConflictRequestError extends ErrorResponse {
    constructor(message = REASON_PHRASE.CONFLICT, statusCode = STATUS_CODE.CONFLICT) {
        super(message, statusCode);
    }
}

// 400 Error
class BadRequestError extends ErrorResponse {
    constructor(message = REASON_PHRASE.BAD_REQUEST, statusCode = STATUS_CODE.BAD_REQUEST) {
        super(message, statusCode);
    }
}

// 401 Error
class AuthFailureError extends ErrorResponse {
    constructor(message = REASON_PHRASE.UNAUTHORIZED, statusCode = STATUS_CODE.UNAUTHORIZED) {
        super(message, statusCode);
    }
}


// 404 Error
class NotFoundError extends ErrorResponse {
    constructor(message = REASON_PHRASE.NOT_FOUND, statusCode = STATUS_CODE.NOT_FOUND) {
        super(message, statusCode);
    }
}

// 403 Error
class ForbiddenError extends ErrorResponse {
    constructor(message = REASON_PHRASE.FORBIDDEN, statusCode = STATUS_CODE.FORBIDDEN) {
        super(message, statusCode);
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError,
}