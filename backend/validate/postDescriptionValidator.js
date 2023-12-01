const {body} = require('express-validator');

module.exports = function validateDescription(){
  
    return body('description')
    .isLength({min: 100})
    .withMessage("Длина превью должна быть не менее 100 символов");
}