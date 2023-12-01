const APIError = require('../errors/APIError');
const UserService = require('../services/UserService');
const BookmarkService = require('../services/BookmarkService');
const CommentService = require('../services/CommentService');
const RoleService = require('../services/RoleService');
const TokenService = require('../services/TokenService');
const MessageService = require('../services/MessageService');
const SubscribeService = require('../services/SubscribeService');
const PostService = require('../services/PostService');
const {validationResult} = require('express-validator');
const emmiter = require('../../emmiter');



class UserController {
    async getAll(req, res, next){
       try{
           const {page, limit} = req.body;
           const users = await UserService.getAll(page, limit);
           res.status(200).json(users);
           
       }
       catch(e){
        next(e);
       }
    }

    async getOne(req, res, next){
       try{
        const id = req.params.id;
        const user = await UserService.getOne(id);
        res.status(200).json(user);
       }
       catch(e){
         next(e);
       }
    }

    async registration(req, res, next){ 
      try{    
        
       const validationErrors = validationResult(req);
       if (!validationErrors.isEmpty()) {
         return next(APIError.badRequest('Некорректные данные', validationErrors.array()));
       }
       const {username, email, password, avatar_img} = req.body;
       const userData = await UserService.registration(username, password, email, avatar_img);
       res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
       res.status(200).json(userData); 
        }
        catch(e){
          next(e);
        }
    }

    async login(req, res, next){
      try{
        const {email, password} = req.body;
        console.log("email: ", email);
        const userData = await UserService.login(email, password);
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        res.status(200).json(userData);
      }
      catch(e){
        next(e);
      }
        
    }

    async logout(req, res, next){
      try{
          const {refreshToken} = req.cookies;
          const token = await UserService.logout(refreshToken);
          res.clearCookie('refreshToken');
          res.status(200).json(token);
      }
      catch(e){
        next(e);
      }
    }

    async refreshToken(req, res, next){
      try{
        const {refreshToken} = req.cookies;

        const userData = await UserService.refresh(refreshToken);
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        
        res.status(200).json(userData);
      }
      catch(e){
        next(e);
      }
    }

    async check(req, res, next){

    }

    async getProfile(req, res, next){
       try{
        let currentUserId = '';
        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader){
          const user = TokenService.validateAccessToken(authorizationHeader.split(' ')[1]);
                if (user) currentUserId = user.id;
        }
        const {id} = req.params;
        const profileData = await UserService.getProfile(id, currentUserId);
        res.status(200).json(profileData); 
       }
       catch(e){
        next(e);
       }
    }

    async getMainData(req, res, next){
      try{
         const { id } = req.params;
         const mainData = await UserService.getProfileMainData(id);
         res.status(200).json(mainData);
      }
      catch(e){
        next(e);
      }
    }


    async activate(req, res, next){
      try{
        const activation_link = req.params.link;
        await UserService.activateUser(activation_link);
        res.redirect(process.env.ACCOUNT_VERIFY_URL);
      }
      catch(e){
        next(e);
      }

    }

    async updateUser(req, res, next){
      try{
      const userData = req.body;
     const updatedUser = await UserService.updateUser(userData);
      res.status(200).json(updatedUser);
      }
      catch(e){
        next(e);
      }
    }

    async deleteUser(req, res, next){
      try{
      const {id} = req.body;
      const deletedUser = await UserService.deleteUser(id);
      res.status(200).json(deletedUser);
      }
      catch(e){
        next(e);
      }
    }

    async setPostLike(req, res, next){
       try{
         const {userId, postId, like} = req.body;
         const postLikeInfo = await UserService.setPostLike(userId, postId, like);
         res.status(200).json(postLikeInfo);
       }
       catch(e){
        next(e);
       }
    }

    async setCommentLike(req, res, next){
      try{
        const {userId, commentId, like} = req.body;
        const commentLikeInfo = await UserService.setCommentLike(userId, commentId, like);
        res.status(200).json(commentLikeInfo); 
        
      }
      catch(e){
       next(e);
      }
    }

    async getAllBookmarks(req, res, next){
      try{
        let currentUserId = '';
        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader){
        const user = TokenService.validateAccessToken(authorizationHeader.split(' ')[1]);
        if (user) currentUserId = user.id;
        }
        const userId = req.params.id;
        const { limit, offset } = req.query;
        const bookmarks = await BookmarkService.getAll(userId, currentUserId, limit, offset);
        res.status(200).json(bookmarks);
      }
      catch(e){
      next(e);
      }
    }


    async getAllComments(req, res, next){
      try{
        const userId = req.params.id;
        const userComments = await CommentService.getUserComments(userId);
        res.status(200).json(userComments);
      }
      catch(e){
        next(e);
      }
    }

    async addRole(req, res, next){
      try{
        const {userId, roleId} = req.body;
        const newUserRole = RoleService.addRole(userId, roleId);
        res.status(200).json(newUserRole);
      }
      catch(e){
        next(e);
      }
    }

    async deleteRole(req, res, next){
      try{
        const {userId, roleId} = req.body;
        const deletedUserRole = RoleService.deleteRole(userId, roleId);
        res.status(200).json(deletedUserRole);
      }
      catch(e){
        next(e);
      }
    }

    async getTop(req, res, next){
      try{
        const topUsers = await UserService.getTop();
        res.status(200).json(topUsers);
      }
      catch(e){
        next(e);
      }
    }

    async createMessage(req, res, next){
      try{
       const { content, postImage, userImage, type, href, userId, hrefContent} = req.body;
       await MessageService.createMessage(content, type, href, hrefContent, userImage, postImage, userId);
       const messages = await MessageService.getCount(userId);
       emmiter.emit('messages', messages);
       res.status(200).json(messages);
      }
      catch(e){
        next(e);
      }
    }

    async mailingMessages(req, res, next){
      try{
       const { content, postImage, type, href, userId, hrefContent} = req.body;
       const subscribers = await MessageService.mailingMessages(content, type, href, hrefContent, postImage, userId);
       const messages = await MessageService.getCount(subscribers);
       emmiter.emit('messages', messages);
       res.status(200).json(messages);
      
      }
      catch(e){
        next(e);
      }
    }

    async getMessages(req, res, next){
      try{
          const { id } = req.params;
          const messages = await MessageService.getMessages(id);
          res.status(200).json(messages);
      }
      catch(e){
        next(e);
      }
    }

    async getCount(req, res, next){
      try{
          const { id } = req.params;
          const messagesCount = await MessageService.getCount(id);
          res.status(200).json(messagesCount);
      }
      catch(e){
        next(e);
      }
    }

  async deleteMessages(req, res, next){
    try{
      const { messages } = req.body;
      const deletedMessages = await MessageService.deleteMessage(messages);
      res.status(200).json(deletedMessages);
    }
    catch(e){
      next(e);
    }
  }

  async getSubscribes(req, res, next){
    try{
       const { id } = req.params;
       const subscribes = await SubscribeService.getSubscribes(id);
       res.status(200).json(subscribes); 
    }
    catch(e){
      next(e);
    }
  }

  async getSubscribers(req, res, next){
    try{
       const { id } = req.params;
       const subscribers = await SubscribeService.getSubscribers(id);
       res.status(200).json(subscribers); 
    }
    catch(e){
      next(e);
    }
  }

  async addSubscribe(req, res, next){
    try{
      const { userId, subscriberId } = req.body;
      const subscribe = await SubscribeService.addSubscribe(userId, subscriberId);
      res.status(200).json(subscribe);
    }
    catch(e){
      next(e);
    }
  }

  async unsubscribe(req, res, next){
    try{
      const { id } = req.body;
      const unsubscribe = await SubscribeService.unsubscribe(id);
      res.status(200).json(unsubscribe);
    }
    catch(e){
      next(e);
    }
  }

  async getUserFeed(req, res, next){
    try{
      const { id } = req.params;
      const authorizationHeader = req.headers.authorization;
      const options = req.query;
      if (authorizationHeader){
        const user = TokenService.validateAccessToken(authorizationHeader.split(' ')[1]);
        if (user) options.userId = user.id;
     }
      const feed = await PostService.getUserFeed(id, options);
      res.status(200).json(feed);
    }
    catch(e){
      next(e);
    }
  }

  async getUserFeedOptions(req, res, next){
    try{
        const { id } = req.params;
        const options = await UserService.getUserFeedOptions(id);
        res.status(200).json(options);
    }
    catch(e){
      next(e);
    }
  }

  async updateUserFeed(req, res, next){
    try{
        const { userId, settings } = req.body;
        const updatedFeedSettings = await UserService.updateFeedSettings(userId, settings);
        res.status(200).json(updatedFeedSettings);
    }
    catch(e){
      next(e);
    }
  }
}

module.exports = new UserController();