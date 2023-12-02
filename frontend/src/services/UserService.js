import { apiService, REST_URL } from '../api';
import axios from 'axios';
import { loginAction, logoutAction, errorHandlerAction, setLoading } from '../store/userReducer';

export default class UserService{
   static login(email, password){
     return dispatch => {
        dispatch(setLoading(true));
        apiService.post('/users/login', {email, password})
        .then(res => {
            dispatch(loginAction(res.data.user));
            localStorage.setItem('token', res.data.accessToken);
        })
        .catch(error =>{
            const {message, errors} = error.response.data;
            dispatch(errorHandlerAction(message, errors));
        })
        .finally(() => dispatch(setLoading(false)));
     }
   }

   static registration(email, username, password, avatar_img){
     return dispatch => {
        dispatch(setLoading(true));
        apiService.post('/users/registration', {email, username, password, avatar_img})
        .then(res => {
            dispatch(loginAction(res.data.user))
            localStorage.setItem('token', res.data.accessToken);
        })
        .catch(error => {
            const {message, errors} = error.response.data;
            dispatch(errorHandlerAction(message, errors));
        })
        .finally(() => dispatch(setLoading(false)));
     }
   }

   static logout(){
      return dispatch => {
        apiService.post('/users/logout')
        .then(() => {
            localStorage.removeItem('token');
            dispatch(logoutAction());
        })
        .catch(error => console.log(error));
      }
   }
   static refresh(){
      return dispatch => {
         dispatch(setLoading(true));
        axios.get(`${REST_URL}/users/token/refresh`, {withCredentials: true})
        .then(res => {
            dispatch(loginAction(res.data.user));
            localStorage.setItem('token', res.data.accessToken);
        })
        .catch(error => {
         const {message, errors} = error.response.data;
         dispatch(errorHandlerAction(message, errors));
        })
        .finally(() => dispatch(setLoading(false)));
      }
   }

   static async getAll(query){
      const users = await apiService.get(`/users${query}`);
      return users.data;
   }

   static async getOne(id){
    const user = await apiService.get(`/users/${id}`);
    return user.data;
   }

   static async getProfile(id){
      const profile = await apiService.get(`/users/profile/${id}`);
      return profile.data;
   }

   static async getMain(id){
      const profile = await apiService.get(`/users/profile/${id}/main`);
      return profile.data;
   }

   static async update(userData){
      const updatedUser = await apiService.put('/users/update', userData);
      return updatedUser.data;
   }

   static async delete(id){
    const deletedUser = await apiService.delete('/users/delete', id);
    return deletedUser.data;
   }

   static async activate(link){
     const activated = await apiService.get(`/users/activate/${link}`);
     return activated.data;
   }

   static async getComments(id){
      const comments = await apiService.get(`/users/${id}/comments`);
      return comments.data;
   }

   static async getBookmarks(id){
    const bookmarks = await apiService.get(`/users/${id}/bookmarks`);
    return bookmarks.data;
   }

   static async getTop(){
      const topUsers = await apiService.get('/users/top/week');
      return topUsers;
   }

   static async setPostLike(postId, userId, like) {
       const user_post_like = await apiService.put('/users/post/mark', {userId, postId, like});
       return user_post_like.data;
   }

   static async setCommentLike(commentId, userId, like){
      const commentLikeData = await apiService.put('/users/comment/mark', {commentId, userId, like});
      return commentLikeData.data;
   }

   static async getFeed(userId){
      const feed = await apiService.get(`/users/${userId}/feed`);
      return feed.data;
   }

   static async getFeedOptions(userId){
      const feedOptions = await apiService.get(`/users/${userId}/feed/settings`);
      return feedOptions.data;
   }

   static async updateFeedSettings(settings){
      const updatedSettings = await apiService.put('/users/feed/settings/update', settings);
      return updatedSettings.data;
   }
   
}