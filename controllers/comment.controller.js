'use strict';

const { OKSuccessResponse } = require('../core/success.response');
const CommentService = require('../services/comment.service');

class CommentController {
    async createComment(req, res, next) {
        const data = await CommentService.createComment(req.body);
        return new OKSuccessResponse({
            message: 'create new comment successfully!',
            code: 201,
            metadata: { data },
        }).send(res);
    }

    async getCommentsByParentID(req, res, next) {
        const data = await CommentService.getCommentsByParentID(req.query);
        return new OKSuccessResponse({
            message: 'get comments by parent id successfully!',
            code: 201,
            metadata: { data },
        }).send(res);
    }
}

module.exports = new CommentController();