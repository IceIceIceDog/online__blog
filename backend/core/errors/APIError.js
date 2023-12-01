class APIError extends Error{
    constructor(status, message, errors){
        super();
        this.message = message;
        this.status = status;
        this.errors = errors;
    }

    static badRequest(message, errors = []){
       return new APIError(400, message, errors);
    }

    static forbidden(){
        return new APIError(403, 'Отказано в доступе');
    }

    static UnauthorizedError(){
        return new APIError(401, 'Пользователь не авторизован');
    }

    static internalError(){
        return new APIError(500, 'Внутренняя ошибка сервера');
    }
}

module.exports = APIError;