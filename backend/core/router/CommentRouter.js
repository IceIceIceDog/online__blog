const Router = require('express').Router;
const commentController = require('../controllers/CommentController');
const authorizeCheck = require('../middlewares/AuthorizeCheckMiddleware');

const commentRouter = new Router();

commentRouter.get('/', commentController.getAll);
commentRouter.get('/:id', commentController.getOne);
commentRouter.post('/add', authorizeCheck,  commentController.addComment);
commentRouter.put('/update', authorizeCheck, commentController.updateComment)
commentRouter.delete('/delete', authorizeCheck, commentController.deleteComment);

module.exports = commentRouter;