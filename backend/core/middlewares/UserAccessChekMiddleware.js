const APIError = require('../errors/APIError');
const RoleService = require('../services/RoleService');
const TokenService = require('../services/TokenService');

module.exports = function(rolesId){
    return async function(req, res, next){
        try{
       
            const authorizationHeader = req.headers.authorization;
    
            if (!authorizationHeader) return next(APIError.badRequest('1'));
    
            const accessToken = authorizationHeader.split(' ')[1];
    
            if (!accessToken) return next(APIError.UnauthorizedError());
    
            const userData = TokenService.validateAccessToken(accessToken, process.env.JWT_ACCESS_KEY);
    
            if (!userData) return next(APIError.UnauthorizedError());

            const userHasAccess = await RoleService.checkRole(userData.id, rolesId);

           if (!userHasAccess) return next(APIError.forbidden());
    
            req.user = userData;
    
            next();
        }
        catch(e){
            return next(APIError.badRequest(e.message));
        }
    }
}