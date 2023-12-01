const Router = require('express').Router;
const emmiter = require('../../emmiter');

const messageRouter = new Router();

messageRouter.get('/new', (req, res, next) => {
    try{
        res.writeHead(200, {
            'Connection': 'keep-alive',
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache'
           });
           emmiter.on('messages', (messages) => {
            res.write(`data: ${JSON.stringify(messages)} \n\n`)
           })
    }
    catch(e){
        next(e);
    }
});

module.exports = messageRouter;