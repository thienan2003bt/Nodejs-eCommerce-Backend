'use strict';

const { NotFoundError } = require('../core/error.response');
const commentModel = require('../models/comment.model');
const Utils = require('../utils/index');

class CommentService {
    static async createComment({ userID, productID, content, parentID = null }) {
        const newComment = await commentModel({
            comment_productID: productID,
            comment_userID: userID,
            comment_parentID: parentID,
            comment_content: content,
        });

        let rightValue = 1;
        if (parentID) {
            const parentComment = await commentModel.findById(parentID);
            if (!parentComment) {
                throw new NotFoundError('Parent comment not found!');
            }

            rightValue = parentComment.comment_right;

            await commentModel.updateMany(
                {
                    comment_productID: Utils.convertToObjectIdMongoose(productID),
                    comment_right: { $gte: rightValue }
                },
                { $inc: { comment_right: 2 } }
            )
            await commentModel.updateMany(
                {
                    comment_productID: Utils.convertToObjectIdMongoose(productID),
                    comment_left: { $gt: rightValue }
                },
                { $inc: { comment_left: 2 } }
            )
        } else {
            const maxRightValue = await commentModel.findOne(
                { comment_productID: Utils.convertToObjectIdMongoose(productID) },
                'comment_right',
                { sort: { comment_right: -1 } }
            )

            rightValue = maxRightValue ? (maxRightValue.comment_right + 1) : 1;
        }
        newComment.comment_left = rightValue;
        newComment.comment_right = rightValue + 1;

        await newComment.save();
        return newComment;
    }


    static async getCommentsByParentID({ productID, parentID = null, limit = 50, skip = 0 }) {
        if (parentID) {
            const parentComment = await commentModel.findById(parentID);
            if (!parentComment) {
                throw new NotFoundError('Parent comment not found!');
            }

            const comments = await commentModel.find({
                comment_productID: Utils.convertToObjectIdMongoose(productID),
                comment_parentID: Utils.convertToObjectIdMongoose(parentID),
                comment_left: { $gt: parentComment.comment_left },
                comment_right: { $lt: parentComment.comment_right }
            }).sort({ comment_left: 1 }).skip(skip).limit(limit)

            return comments;
        }

        const comments = await commentModel.find({
            comment_productID: Utils.convertToObjectIdMongoose(productID),
            comment_parentID: parentID,
        }).select({ comment_left: 1, comment_right: 1, comment_parentID: 1, comment_content: 1 })
            .sort({ comment_left: 1 }).skip(skip).limit(limit)

        return comments;
    }
}

module.exports = CommentService;