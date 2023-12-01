import apiService from "../api";

export default class SubscribeService{
    static async subscribe(userId, subscriberId){
        const subscribe = await apiService.post('/users/subscribes/add', {userId, subscriberId});
        return subscribe.data;
    }

    static async getSubscribes(userId){
        const subscribes = await apiService.get(`/users/${userId}/subscribes`);
        return subscribes.data;
    }

    static async getSubscribers(userId){
        const subscribers = await apiService.get(`/users/${userId}/subscribers`);
        return subscribers.data;
    }

    static async unsubscribe(id){
        const deletedSubscribe = await apiService.delete('/users/subscribes/delete', {data: {id}});
        return deletedSubscribe.data;
    }

}