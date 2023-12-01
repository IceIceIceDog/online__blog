const {Sequelize} = require('sequelize');



module.exports = new Sequelize(
    'online_blog',
    'root',
    'root',
    {
        dialect: 'mysql',
        host: 'localhost',
        port: '3306'
    }
);