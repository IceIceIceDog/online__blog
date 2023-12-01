const Router = require('express').Router;
const postController = require('../controllers/PostController');
const titleValidator = require('../../validate/postTitleValidator');
const descriptionValidator = require('../../validate/postDescriptionValidator');
const contentValidator = require('../../validate/postContentValidator');
const authorizeCheck = require('../middlewares/AuthorizeCheckMiddleware');
const PostController = require('../controllers/PostController');

const postRouter = new Router();

postRouter.get('/new', postController.getNewPosts);
postRouter.post('/add', authorizeCheck, titleValidator(), descriptionValidator(), contentValidator(),    postController.addPost);
postRouter.post('/image/insert', postController.InsertImage);
postRouter.post('/subjects/add', authorizeCheck, postController.addSubject);
postRouter.get('/subjects', postController.getAllSubjects);
postRouter.get('/', postController.getAll);
postRouter.get('/:id', postController.getOne);
postRouter.get('/categories/:categoryAlias', postController.getPostsFromCategory);
postRouter.get('/:id/comments', postController.getAllPostComments);
postRouter.get('/top/week', PostController.getTop);
postRouter.put('/update', authorizeCheck, titleValidator(), descriptionValidator(), contentValidator(), postController.updatePost);
postRouter.delete('/delete', authorizeCheck, postController.deletePost);
postRouter.delete('/subjects/delete', authorizeCheck, postController.deleteSubjects);




module.exports = postRouter;