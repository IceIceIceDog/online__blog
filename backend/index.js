require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const cookieParser = require('cookie-parser');
const models = require('./core/models/models');
const router = require('./core/router/Router');
const fileLoader = require('express-fileupload');
const path = require('path');
const errorHandler = require('./core/middlewares/ErrorMiddleware');
const PORT = process.env.PORT || 7000;




const app = express();
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json({limit: '10mb'}));
app.use(fileLoader({}));
app.use(cookieParser());
app.use('/api', router);
app.use(express.static(path.resolve(__dirname, 'userfiles')));

// Обработчик ошибок
app.use(errorHandler);

const start = async () => {
    try{
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`server is working on port ${PORT}`));
    }
    catch(e){
        console.log(e.message);
    }
}

start();






