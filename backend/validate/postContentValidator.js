const {body} = require('express-validator');

module.exports = function validateContent(){
  
    return body('content')
    .isLength({min: 150})
    .withMessage("Длина содержимого должна быть не менее 150 символов");
}