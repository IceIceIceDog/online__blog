import { apiService } from "../api";

export default class CommentService{
    static async getAllPostComments(postId, limit, offset){
        const comments = await apiService.get(`/posts/${postId}/comments?limit=${limit}&offset=${offset}`);
        return comments;
    }

    static async getAllUserComments(userId){
        const comments = await apiService.get(`/users/${userId}/comments`);
        return comments;
    }

    static async addComment(comment){
        const newComment = await apiService.post(`/comments/add`, comment);
        return newComment.data;
    }

    static async deleteComment(commentId){
        const deletedComment = await apiService.delete('/comments/delete', {data: {id: commentId}});
        return deletedComment.data;
    }

    static async updateComment(commentId, content){
        const updatedComment = await apiService.put('/comments/update', {commentId, content});
        return updatedComment.data;
    }
}