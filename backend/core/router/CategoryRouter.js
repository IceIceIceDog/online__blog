const Router = require('express').Router;
const categoryController = require('../controllers/CategoryController');
const userAccessCheck = require('../middlewares/UserAccessChekMiddleware');
const authorizeCheck = require('../middlewares/AuthorizeCheckMiddleware');

const categoryRouter = new Router();

categoryRouter.post('/create', authorizeCheck,  categoryController.create);
categoryRouter.get('/', categoryController.getAll);
categoryRouter.get('/:id', userAccessCheck(process.env.ADMIN_ID), categoryController.getOne);
categoryRouter.put('/update', userAccessCheck(process.env.ADMIN_ID), categoryController.update);
categoryRouter.delete('/delete', userAccessCheck(process.env.ADMIN_ID), categoryController.delete);

module.exports = categoryRouter;