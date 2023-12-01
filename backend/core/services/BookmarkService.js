const {PostInBookMark, Post, UserPostLike, User} = require('../models/models');
const { Op } = require('sequelize');

class BookmarkService{
    async getAll(userId, currentUserId, limit, offset){
     
   /*   const options = {include: [
        {model: PostInBookMark, attributes: [], where: {userId}, required: true},
        {model: User, attributes: ['id', 'username', 'avatar_img']}
      ]};

      if (currentUserId) options.include = [...options.include,
        {model: UserPostLike, where:{userId: currentUserId}, required: false},
        {model: PostInBookMark, attributes: ['id'], where: {userId: currentUserId}, required: false}
      ];

      const bookmarkedPosts = await Post.findAndCountAll({...options, limit: +limit, offset: +offset});

     

      return bookmarkedPosts; */
      
      const options = {include: [{model: User, attributes: ['id', 'username', 'avatar_img']}]};

      const posts = await PostInBookMark.findAll({where: {userId}, attributes: ['postId']})
      
      const postsIds = posts.map(item => item = item.postId);

      if (currentUserId) {
        options.include = [...options.include,
          {model: UserPostLike, where:{userId: currentUserId}, required: false},
          {model: PostInBookMark, attributes: ['id'], where: {userId: currentUserId}, required: false}
        ];
      }

      const bookmarks = await Post.findAndCountAll({...options, where: {id: {[Op.in]: postsIds}}, limit: +limit, offset: +offset * +limit})

      return bookmarks;
    }


    async deleteBookmark(bookmarkId){
        const deletedBookmark = await PostInBookMark.findOne({where: {id: bookmarkId}});
        await Post.decrement('bookmark', {where: {id: deletedBookmark.postId}});
        await deletedBookmark.destroy();
        return 1;
    }

    async addBookmark(userId, postId){
       const bookmark = PostInBookMark.create({userId, postId});
       await Post.increment('bookmark', {where: {id: postId}});
       return bookmark;
    }
}

module.exports = new BookmarkService();