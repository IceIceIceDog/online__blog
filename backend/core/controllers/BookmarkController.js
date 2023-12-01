const BookmarkService = require('../services/BookmarkService');

class BookmarkController{
    async deleteBookmark(req, res, next){
        try{
          const {bookmarkId} = req.body;
          const deletedBookmark = await BookmarkService.deleteBookmark(bookmarkId);
          res.status(200).json(deletedBookmark);
        }
        catch(e){
         next(e);
        }
    }

    async addBookmark(req, res, next){
        try{
           const {userId, postId} = req.body;
           const newBookmark = await BookmarkService.addBookmark(userId, postId);
           res.status(200).json(newBookmark);
        }
        catch(e){
         next(e);
        }
    }
}

module.exports = new BookmarkController();