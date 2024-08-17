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

// 403 Error
class BadRequestError extends ErrorResponse {
    constructor(message = REASON_PHRASE.FORBIDDEN, statusCode = STATUS_CODE.FORBIDDEN) {
        super(message, statusCode);
    }
}

// 401 Error
class AuthFailureError extends ErrorResponse {
    constructor(message = REASON_PHRASE.UNAUTHORIZED, statusCode = STATUS_CODE.UNAUTHORIZED) {
        super(message, statusCode);
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
}