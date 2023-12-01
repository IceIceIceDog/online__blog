const Router = require('express').Router;
const userController = require('../controllers/UserController');
const emailValidator = require('../../validate/emailValidator');
const loginValidator = require('../../validate/loginValidator');
const passwordValidator = require('../../validate/PasswordValidator');
const authorizationCheck = require('../middlewares/AuthorizeCheckMiddleware');
const accessCheck = require('../middlewares/UserAccessChekMiddleware');

const userRouter = new Router();

userRouter.get('/', accessCheck(process.env.ADMIN_ID), userController.getAll); // Административный роут, вывод информации о пользователях;
userRouter.get('/:id', accessCheck(process.env.ADMIN_ID), userController.getOne); // Административный роут роут, детальная информация о пользователе;
userRouter.get('/profile/:id', userController.getProfile); // информация о профиле пользователя;
userRouter.get('/profile/:id/main', userController.getMainData);
userRouter.get('/activate/:link', userController.activate); // Активация учетной записи;
userRouter.get('/token/refresh', userController.refreshToken); //Обновление токена;
userRouter.get('/:id/bookmarks', userController.getAllBookmarks); //Получение закладок пользователя;
userRouter.get('/:id/comments', userController.getAllComments); //Получение всех комментариев пользователя;
userRouter.get('/:id/feed', userController.getUserFeed); //Получение ленты пользователя;
userRouter.get('/top/week', userController.getTop); // Получение топа пользователей;
userRouter.get('/:id/messages', authorizationCheck, userController.getMessages); // Получение уведомлений;
userRouter.get('/:id/messages/count',  userController.getCount); // Получение количества уведомлений;
//userRouter.get('/messages/new', userController.getMessagesCount);
userRouter.get('/:id/subscribes', userController.getSubscribes) // Получение всех пользователей на которых подписан текущий;
userRouter.get('/:id/subscribers', userController.getSubscribers) // Получение всех подписчиков пользователя;
userRouter.get('/:id/feed/settings', userController.getUserFeedOptions) // Получение настроек ленты пользователя;
userRouter.post('/registration', emailValidator(), loginValidator(), passwordValidator(), userController.registration); // Регистрация пользователя;
userRouter.post('/login', userController.login); // Авторизация пользователя;
userRouter.post('/logout', userController.logout); // Выход из учетной записи;
userRouter.post('/roles/add', accessCheck(process.env.ADMIN_ID), userController.addRole); //Добавление роли пользователю;
userRouter.post('/messages/add', userController.createMessage); // Создание уведомлений;
userRouter.post('/messages/mailing', userController.mailingMessages); // Рассылка уведомлений подписчикам пользователя;
userRouter.post('/subscribes/add', authorizationCheck, userController.addSubscribe); //Подписка на пользователя;
userRouter.put('/post/mark', authorizationCheck, userController.setPostLike); // Оценка поста;
userRouter.put('/comment/mark', authorizationCheck, userController.setCommentLike); // Оценка комментария;
userRouter.put('/update', authorizationCheck, userController.updateUser); //Обновление пользователя;
userRouter.put('/feed/settings/update', userController.updateUserFeed); //Обновление настроек ленты пользователя;
userRouter.delete('/delete', authorizationCheck, userController.deleteUser); // Удаление пользователя;
userRouter.delete('/roles/delete', accessCheck(process.env.ADMIN_ID),  userController.deleteRole) // Удаление роли пользователя;
userRouter.delete(`/messages/delete`, authorizationCheck, userController.deleteMessages); // Удаление уведомлений;
userRouter.delete('/subscribes/delete', authorizationCheck, userController.unsubscribe);


module.exports = userRouter;