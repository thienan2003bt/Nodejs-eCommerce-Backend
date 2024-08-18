'use strict';
const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
}

const REASON_STATUS_CODE = {
    OK: 'Success',
    CREATED: 'Created',
}

class SuccessResponse {
    constructor({ message, metadata = {}, statusCode = STATUS_CODE.OK, reason = REASON_STATUS_CODE.OK }) {
        this.message = message ?? reason;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        return res.status(this.status ?? STATUS_CODE.OK).json(this);
    }
}

class OKSuccessResponse extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
    }
}

class CreatedSuccessResponse extends SuccessResponse {
    constructor({ message, metadata, statusCode = STATUS_CODE.OK, reason = REASON_STATUS_CODE.OK, options = {} }) {
        super({ message, metadata, statusCode, reason });
        this.options = options;
    }
}

module.exports = {
    OKSuccessResponse,
    CreatedSuccessResponse,
}