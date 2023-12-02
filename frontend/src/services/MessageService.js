import { apiService } from "../api";
import { setAction } from "../store/messageReducer";

export default class MessageService{
    static getCount(userId){
        return dispatch => {
            apiService.get(`/users/${userId}/messages/count`)
            .then(res => dispatch(setAction(res.data.count)))
            .catch(error => console.log(error));
        }
    }

    static async createMessage(messageData){
        await apiService.post(`/users/messages/add`, messageData);
    }

    static async getMessages(userId){
        const messages = await apiService.get(`/users/${userId}/messages`);
        return messages;
    }
    
    static async deleteMessages(messages){
        const deletedMessages = apiService.delete('/users/messages/delete', {data: {messages}});
        return deletedMessages;
    }

    static async mailingMessages(messageData){
        await apiService.post(`/users/messages/mailing`, messageData);
    }
}