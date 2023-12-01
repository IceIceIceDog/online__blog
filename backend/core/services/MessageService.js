const APIError = require('../errors/APIError');
const { Messages, Subscribers } = require('../models/models');
const { Op, fn, col } = require('sequelize');

class MessageService{
    static async createMessage(content, type, href, hrefContent, userImage = null, postImage = null, userId){

       switch(type){
        case 'post': 
        await Messages.create({content, type, href, hrefContent, postImage, userId, defaultImage: false});
        break;
        case 'comment':
        await Messages.create({content, type, userImage, href, hrefContent, userId, defaultImage: false});
        break;
        case 'subscribe':
        await Messages.create({content, type, href, hrefContent,  userImage, userId, defaultImage: false});
        break;
        case 'message':
        await Messages.create({content, type, href,  hrefContent, userId, defaultImage: true});
        break;
        default: 
        throw APIError.badRequest('Некорректные данные');
       }
    }

    static async mailingMessages(content, type, href, hrefContent, postImage, userId){
        const subscribers = await Subscribers.findAll({where: {userId}});
        const options = subscribers.map(item => ({content, type, href, hrefContent, postImage, defaultImage: false, userId: item.subscriberId }));
        await Messages.bulkCreate(options);
        return subscribers.map(item => item = item.subscriberId);
    }

    static async deleteMessage(messagesId){
        const deletedMessages = await Messages.destroy({where: {id: {[Op.in]: messagesId}}});
        return deletedMessages;
    }

    static async getMessages(userId){
        const messages = await Messages.findAll({where: {userId}});
        return messages;
    }

    static async getCount(userId){
      if (Array.isArray(userId)) {
        const messagesCounts = await Messages.findAll({attributes: ['userId',
           [fn('COUNT', col('id')), 'count']
        ], where: {userId: {[Op.in]: userId}}, group: ['userId']});
        return messagesCounts.map(item => item = item.dataValues);
      }
      const messages = await Messages.count({where: {userId}});
      return {userId, count: messages};
    }
}

module.exports = MessageService;