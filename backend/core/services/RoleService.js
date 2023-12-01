const {Role, UserRoles} = require('../models/models');
const {Op} = require('sequelize');
const APIError =require('../errors/APIError');

class RoleService{
    async addRole(userId, roleId){
        const newUserRole = await UserRoles.findOrCreate({userId, roleId});

        if (newUserRole[1] === true) throw APIError.badRequest('пользователь уже имеет эту роль');

        return newUserRole[0];
    }

    async deleteRole(userId, roleId){
        const deletedUserRole = await UserRoles.destroy({where: {userId, roleId}});
        return deletedUserRole;
    }

    async checkRole(userId, rolesId){
        const rolesIdIsArray = Array.isArray(rolesId);
        
        let roles;

        switch(rolesIdIsArray){
            case true:
            roles = await UserRoles.findAll({where: {userId, roleId: {[Op.in]: rolesId}}});
            break;
            case false:
            roles = await UserRoles.findAll({where: {userId, roleId: rolesId}});
            break;
            default:
            throw APIError.badRequest('Некорректные данные');    
        }

        if (!roles || roles.length === 0) return false;

        return true;
    }
}

module.exports = new RoleService();