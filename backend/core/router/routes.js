const userRouter = require('./UserRouter');
const postRouter = require('./PostRouter');
const commentRouter = require('./CommentRouter');
const categoryRouter = require('./CategoryRouter');
const bookmarkRouter = require('./BookmarkRouter');
const messageRouter = require('./MessageRouter');


const routes = [
    {url: '/users', router: userRouter},
    {url:'/posts', router: postRouter},
    {url: '/comments', router: commentRouter},
    {url: '/categories', router: categoryRouter},
    {url: '/bookmarks', router: bookmarkRouter},
    {url: '/messages', router: messageRouter}
];


module.exports = routes;