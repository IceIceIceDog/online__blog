const {body} = require('express-validator');

module.exports = function validatetitle(){
  
    return body('title')
    .isLength({min: 50, max: 200})
    .withMessage("Длина заголовка должна быть в пределах от 50 до 200 символов");
    
}