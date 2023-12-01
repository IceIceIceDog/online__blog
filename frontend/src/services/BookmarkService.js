
import apiService from "../api";

export default class BookmarkService{
    static async addBookmark(postId, userId){
        const bookmark = await apiService.post('/bookmarks/add', {postId, userId});
        return bookmark.data;
    }

    static async deleteBookmark(bookmarkId){
        const deletedBookmark = await apiService.delete('/bookmarks/delete', {data:{bookmarkId}});
        return deletedBookmark.data;
    }
    
    static async getAll(userId, limit, offset){
       const bookmarks = await apiService.get(`/users/${userId}/bookmarks?limit=${limit}&offset=${offset}`);
       return bookmarks;
    }
}