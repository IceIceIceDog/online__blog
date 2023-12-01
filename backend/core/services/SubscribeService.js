const { Subscribers, User } = require('../models/models');
const { Op } = require('sequelize');
const emmiter = require('../../emmiter');
const MessageService = require('../services/MessageService');

class SubscribeService{

    static async getSubscribers(userId){
       const subscribers = await Subscribers.findAll({attributes: ['subscriberId'], where: {userId}});
       const subscriberIds = subscribers.map(item => item = item.subscriberId);
       const users = await User.findAndCountAll({attributes:['id', 'username', 'avatar_img', 'rate', 'decency'] , 
       where: {id: {[Op.in]: subscriberIds}}});
       return users;
    }

    static async getSubscribes(userId){
        const subscribes = await User.findAndCountAll({attributes: ['id', 'username', 'avatar_img', 'rate', 'decency'], include: [
            {model: Subscribers, attributes: ['id'], where: {subscriberId: userId}}
        ]});
        return subscribes;
    }

    static async addSubscribe(userId, subscriberId){
        const subscribe = await Subscribers.create({userId, subscriberId});
        
        const subscriber = await User.findOne({where: {id: subscriberId}, attributes: ['username', 'avatar_img']});
        
        await MessageService.createMessage(
         `Пользователь ${subscriber.username} подписался(-лась) на вас.`,
         'subscribe',
         `/profile/${subscriberId}`,
         'Перейти к профилю',
         subscriber.avatar_img,
         null,
         userId
        );

        const messages = await MessageService.getCount(userId);

        emmiter.emit('messages', messages);

        return subscribe;
    }

    static async unsubscribe(id){

        const unsubscriberId = await Subscribers.findOne({where: {id}, attributes: ['subscriberId', 'userId']});

        const unsubscriber = await User.findOne({where: {id: unsubscriberId.subscriberId}, attributes: ['id', 'avatar_img', 'username']});

    await MessageService.createMessage(
            `Пользователь ${unsubscriber.username} отписался(-лась) на вас.`,
            'subscribe',
            `/profile/${unsubscriber.id}`,
            'Перейти к профилю',
            unsubscriber.avatar_img,
            null,
            unsubscriberId.userId   
        ); 


        const messages = await MessageService.getCount(unsubscriberId.userId);
        
        const deletedSubscribe = await Subscribers.destroy({where: {id}});

        emmiter.emit('messages', messages);
        
        return deletedSubscribe;  

        
}
}

module.exports = SubscribeService;