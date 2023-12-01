const APIError = require('../errors/APIError');
const {Comment, User, UserCommentLike, Post} = require('../models/models');
const MessageService = require('./MessageService');
const emmiter = require('../../emmiter');

class CommentService{
    async addComment(commentContent, postId, userId){
        const comment = await Comment.create({content: commentContent, postId, userId});
        const user = await User.findOne({where: {id: userId}, attributes: ['id', 'avatar_img', 'username']});
        Post.increment('comment', {where: {id: postId}});
        
        const author = await Post.findOne({where: {id: postId}, attributes: [],  include: [{model: User, attributes: ['id']}]});

        await MessageService.createMessage(
        `Пользователь ${user.username} оставил комментарий на вашу публикацию :`,
        'comment',
        `/posts/${postId}#comments`,
        'Перейти к комментариям',
        user.avatar_img,
        null,
        author.user.id
        );

        const messages = await MessageService.getCount(author.user.id);

        emmiter.emit('messages', messages);

        return {...comment.dataValues, user}; 
        
    }

    async updateComment(content, commentId){
        const updatedComment = await Comment.update({content}, {where: {id: commentId}});
        return updatedComment;
    }

    async getAllPostComments(postId, userId = '', limit, offset){
       const options = {where: {postId}, include: [{model: User, attributes: ['id', 'username', 'avatar_img']}]};

       if (userId) options.include = [...options.include, {model: UserCommentLike, where: {userId}, required: false}];


       const comments = await Comment.findAndCountAll({...options, limit:+limit, offset:+offset * +limit});

       return comments;
    }

    async getOne(commentId){
        const comment = await Comment.findByPk(commentId);
        return comment;
    }

    async getUserComments(userId){
        const userComments = await Comment.findAndCountAll({where:{userId}, include: [
            {model: User, attributes: ['id', 'username', 'avatar_img']},
            {model: UserCommentLike, where: {userId}, required: false}
        
        ]});

        return userComments;
    }
   
    async getAll(){
        const comments = await Comment.findAll();
        return comments;
    }

    async deleteComment(commentId){
        const deletedComment = await Comment.findOne({where: {id: commentId}});
        
        await Post.decrement('comment', {where: {id: deletedComment.postId}});

        const deletedId = deletedComment.id;

        await deletedComment.destroy();

        return deletedId;
    }

}

module.exports = new CommentService();