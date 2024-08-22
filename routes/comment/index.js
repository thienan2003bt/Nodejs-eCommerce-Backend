const router = require('express').Router();
const { authenticationV2 } = require('../../auth/auth.utils');
const { aSyncHandler } = require('../../helpers/asyncHandler');
const CommentController = require('../../controllers/comment.controller');


router.use(authenticationV2);

router.post('/', aSyncHandler(CommentController.createComment))
router.get('/', aSyncHandler(CommentController.getCommentsByParentID))
router.delete('/', aSyncHandler(CommentController.deleteComment))


module.exports = router;