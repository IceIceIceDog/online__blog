const Router = require('express').Router;
const BookmarkController = require('../controllers/BookmarkController');
const autorizeCheck = require('../middlewares/AuthorizeCheckMiddleware');

const bookmarkRouter = new Router();

bookmarkRouter.post('/add', autorizeCheck, BookmarkController.addBookmark);
bookmarkRouter.delete('/delete', autorizeCheck, BookmarkController.deleteBookmark);

module.exports = bookmarkRouter;