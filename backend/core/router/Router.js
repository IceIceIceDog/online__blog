const Router = require('express').Router;
const routes = require('./routes');

const router = new Router();

routes.forEach(route => {
    router.use(route.url, route.router);
});

module.exports = router;