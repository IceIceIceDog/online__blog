const {body} = require('express-validator');

module.exports = function validateLogin(){
  
    return body('username')
    .isLength({min: 2, max: 20})
    .withMessage('Имя пользователя должно находиться в пределах от 2 до 20 символов');
    
}