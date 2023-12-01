const CommentService = require('../services/CommentService');

class CommentController{
    async addComment(req, res, next){
        try{
           const {commentContent, postId, userId} = req.body;
           const comment = await CommentService.addComment(commentContent, postId, userId);
           res.status(200).json(comment);
        }
        catch(e){
          next(e);
        }
    }

    async updateComment(req, res, next){
        try{
           const {commentId, content} = req.body;
           const updatedComment = await CommentService.updateComment(content, commentId);
           res.status(200).json(updatedComment);
        }
        catch(e){
           next(e);
        }
    }



    async getOne(req, res, next){
        try{
           const commentId = req.params.id;
           const comment = await CommentService.getOne(commentId);
           res.status(200).json(comment);
        }
        catch(e){
         next(e);
        }
    }

   

    async getAll(req, res, next){
        try{
         const comments = await CommentService.getAll();
         res.status(200).json(comments);
        }
        catch(e){
          next(e);
        }
    }

    async deleteComment(req, res, next){
        try{
           const {id} = req.body;
           const deletedComment = await CommentService.deleteComment(id);
           res.status(200).json(deletedComment);
        }
        catch(e){
            next(e);
        }
    }

    
}

module.exports = new CommentController();