import apiService from '../api';
import MessageService from './MessageService';


export default class PostService{
    static async getAll(query = ''){
        try{
            const posts = await apiService.get(`/posts${query}`);
            return posts;
        }
       catch(e){
        console.log(e);
       }
    }

    static async getOne(id){
        const post = await apiService.get(`/posts/${id}`);
        return post;
    }

    static async create(postData){
        const createdPost = await apiService.post(`/posts/add`, postData);
        
        await MessageService.mailingMessages({
            content: 'Один из пользователей на которых вы подписаны опубликовал новый пост:',
            href: `/posts/${createdPost.data.id}`,
            hrefContent: createdPost.data.title,
            postImage: createdPost.data.img,
            type: 'post',
            userId: createdPost.data.userId
        }); 
        return createdPost;
    }

    static async getPostComments(id){
        const postComments = await apiService.get(`/posts/${id}/comments`);
        return postComments;
    }

    static async updatePost(postData){
        const updatedPost = await apiService.put('/posts/update', postData); 
        return updatedPost;
    }

    static async deletePost(id){
        const deletedPost = await apiService.delete(`/posts/delete`, {data: {id}});
        return deletedPost;
    }

    static async getTopArticles(){
        const topArticles = await apiService.get('/posts/top/week');
        return topArticles;
    }


}