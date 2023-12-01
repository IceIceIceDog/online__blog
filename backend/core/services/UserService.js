const {User,
  Post, 
  PostInBookMark, 
  Comment, 
  UserPostLike, 
  UserCommentLike, 
  ProcessedPost, 
  Subscribers,
  PostSubject, 
  FeedSubjects, 
  FeedCategories, 
  Category, 
  UserFeedSettings,
  Messages, 
  } = require('../models/models');
const bcrypt = require('bcrypt');
const generate_link = require('uuid');
const MailService = require('./MailService');
const TokenService = require('./TokenService');
const FileService = require('../services/FileService');
const ApiError = require('../errors/APIError');
const APIError = require('../errors/APIError');
const {Op, fn, col} = require('sequelize');



class UserService{
 async registration(username, password, email, avatar){
    const emailOccupied = await User.findOne({where: {email}});
    
    if (emailOccupied) throw ApiError.badRequest(`Пользователь с почтовым адресом ${email} уже существует`);

    let options = {};

    const hashPassword = await bcrypt.hash(password, 3);

    const activation_link = generate_link.v4();

    options = {...options, activation_link, username, password: hashPassword, email};

    if (avatar) {
      const avatar_img = FileService.uploadBlobData(avatar);
      options = {...options, avatar_img};
    }
    
    const user = await User.create(options);

    await MailService.sendActivateLink(email, activation_link, options.avatar_img);

    await UserFeedSettings.create({userId: user.id, min_rate: 0, low_decency_user: true});

    const userPayload = {email, username, id: user.id};

    const tokens = TokenService.generateTokens(userPayload);

    await TokenService.saveRefreshToken(user.id, tokens.refreshToken);

    return {user: {...userPayload, isActivated: user.email_confirmed, avatar_img: user.avatar_img}, ...tokens};
 }

 async login(email, password){
     const user = await User.findOne({where: {email}});

     if (!user) throw APIError.badRequest('Неверный адрес электронной почты');

     const isPasswordsEqual =   bcrypt.compare(password, user.password);

     if (!isPasswordsEqual) throw APIError.badRequest('Неверный пароль');

     const userPayload = {email, username: user.username, id: user.id};


     const tokens = TokenService.generateTokens(userPayload);

     await TokenService.saveRefreshToken(user.id, tokens.refreshToken);

     return {user: {...userPayload, isActivated: user.email_confirmed, avatar_img: user.avatar_img}, ...tokens};
 }

 async logout(token){
    const refreshToken = await TokenService.removeToken(token);
    return refreshToken;
 }

 async activateUser(activation_link){
   const isActivated = await User.findOne({attributes: ['id' , 'email_confirmed'], where: {activation_link}});

   if (!isActivated) throw ApiError.badRequest('Некорректная ссылка активации');

   if (!isActivated.email_confirmed) {
      isActivated.email_confirmed = true;
      isActivated.save();
      return;
   }
   
   return;
 }

 async getAll(page, limit){
     const users = await User.findAll({limit, offset: page});
     return users;
 }

 async getOne(id){
   const user = await User.findOne({where: {id}});
   return user;
 }

 async refresh(refreshToken){

   if (!refreshToken) throw APIError.UnauthorizedError();

   const tokenPayload = TokenService.validateRefreshToken(refreshToken);

   const tokenInDB = TokenService.findToken(refreshToken);

   if (!tokenInDB || !tokenPayload) throw APIError.UnauthorizedError();

   const user = await User.findOne({where: {id: tokenPayload.id}});

   const newPayload = {email: user.email, username: user.username, id: user.id};

   const tokens = TokenService.generateTokens(newPayload);

   await TokenService.saveRefreshToken(user.id, tokens.refreshToken);

   return {user: {...newPayload, isActivated: user.email_confirmed, avatar_img: user.avatar_img}, ...tokens};
 }

 async getProfile(id, currentUserId){

 const options = {where: {id}, attributes: [
  'id', 'username', 'email_confirmed', 'rate', 'decency', 'avatar_img'
  ]};

  if (currentUserId){
    options.include = [{model:Subscribers, attributes: ['id'], where: {subscriberId: currentUserId}, required: false}];
  }
  
 const userData = await User.findOne(options);
 
 return userData;
 }

 async setPostLike(userId, postId, like){
  const likedPost = await Post.findByPk(postId);
  let postLikeState = await UserPostLike.findOne({where: {userId, postId}});
  
  if (!postLikeState) postLikeState = await UserPostLike.create({userId, postId});

  switch (like){
    case "like":
      if (postLikeState.like === true) {
        postLikeState.like = false;
        likedPost.likes -= 1;
      }
      else if (postLikeState.like === false) {
        if (postLikeState.dislike === true) {
          postLikeState.dislike = false;
          likedPost.dislikes -= 1;
        }
        postLikeState.like = true;
        likedPost.likes += 1;
      }
      break;
     case "dislike":
      if (postLikeState.dislike === true) {
        postLikeState.dislike = false;
        likedPost.dislikes -= 1;
      }
      else if (postLikeState.dislike === false){
        if (postLikeState.like === true) {
          postLikeState.like = false;
          likedPost.likes -= 1;
        }
        postLikeState.dislike = true;
        likedPost.dislikes += 1;
      }
      break;
      default:
        throw APIError.badRequest('Некорректные данные'); 
  }
  
  

  likedPost.rate = (likedPost.likes / (likedPost.dislikes + likedPost.likes)) * 100;
 
  
  await likedPost.save();
  await postLikeState.save();

  const sumUserPostsRate = await Post.findAll({where: {userId: likedPost.userId}, attributes: [
    [fn('SUM', col('rate')), 'rate']
  ]});

  if (!sumUserPostsRate[0].rate) {
    const rate = (likedPost.likes / (likedPost.likes + likedPost.dislikes)) * 100;
    await User.update({rate}, {where: {id: likedPost.userId}});
  }
  else await User.update({rate: sumUserPostsRate[0].rate}, {where: {id: likedPost.userId}});

 return {
    postLikeState: {
      like: postLikeState.like, 
      dislike: postLikeState.dislike
    }, 
    likes: likedPost.likes, 
    dislikes: likedPost.dislikes
  }; 
  }
 

 async setCommentLike(userId, commentId, like){
  const likedComment = await Comment.findByPk(commentId, {attributes: ['id', 'likes', 'dislikes', 'userId']});
  let commentLikeState = await UserCommentLike.findOne({where: {userId, commentId}});
  
  if (!commentLikeState) commentLikeState = await UserCommentLike.create({userId, commentId});
  
  switch(like){
    case "like":
      if (commentLikeState.like === true) {
        commentLikeState.like = false;
        likedComment.likes -= 1;
      }
      else if (commentLikeState.like === false) {
        if (commentLikeState.dislike === true) {
          commentLikeState.dislike = false;
          likedComment.dislikes -= 1;
        }
        commentLikeState.like = true;
        likedComment.likes += 1;
      }
      break;
     case "dislike":
      if (commentLikeState.dislike === true) {
        commentLikeState.dislike = false;
        likedComment.dislikes -= 1;
      }
      else if (commentLikeState.dislike === false){
        if (commentLikeState.like === true) {
          commentLikeState.like = false;
          likedComment.likes -= 1;
        }
        commentLikeState.dislike = true;
        likedComment.dislikes += 1;
      }
      break;
      default:
        throw APIError.badRequest('Некорректные данные');
  }
  
  
  await likedComment.save();
  await commentLikeState.save();

  const userCommentLikes = await Comment.findAll({attributes: [
    [fn('SUM', col('likes')), 'likes']
  ], where: {userId: likedComment.userId}});

  const userCommentDislikes = await Comment.findAll({attributes: [
    [fn('SUM', col('dislikes')), 'dislikes']
  ], where: {userId: likedComment.userId}});

  const likes = userCommentLikes[0].likes;

  const dislikes = userCommentDislikes[0].dislikes;

  const decency = (likes / (dislikes + likes)) * 10000;

  console.log(decency);


  await User.update({decency}, {where: {id: likedComment.userId}}); 

 

  return {
    commentLikeState: {
      like: commentLikeState.like, 
      dislike: commentLikeState.dislike
    }, 
    likes: likedComment.likes, 
    dislikes: likedComment.dislikes
  };
}

 

 async updateUser(userData){
    if (userData.avatar_img){
      let oldImage = '';
      const user = await User.findOne({where: {id: userData.id}});
      if (user.avatar_img) {
        oldImage = user.avatar_img;
        FileService.deleteUploadedImage(user.avatar_img);
      }
      const avatar_img = FileService.uploadBlobData(userData.avatar_img);
      await Messages.update({userImage: avatar_img}, {where: {type: {[Op.in]: ['subscribe', 'comment']}, userImage: oldImage}});
      await User.update({...userData, avatar_img}, {where: {id: userData.id}});
      const newUser = User.findByPk(userData.id);
      return newUser;
    }

    if (userData.passwordData.current){
      const currentUser = await User.findOne({where: {id: userData.id}});
      const {current} = userData.passwordData;
      const passwordIsValid = await bcrypt.compare(current, currentUser.password);
      if (passwordIsValid){
        const { newPassword } = userData.passwordData;
        const updatedPassword = await bcrypt.hash(newPassword, 3);
        await User.update({password: updatedPassword}, {where: {id: userData.id}});
      }
      else throw APIError.badRequest('Неверный пароль');
    }
    
     await User.update({...userData}, {where: {id: userData.id}});
     const updatedUser = await User.findByPk(userData.id);
     return updatedUser;
 }

 async deleteUser(userId){
  const deletedUser = await User.destroy({where: {id: userId}});
  return deletedUser;
 }

 async getTop(){

  const currentDate = new Date();

  const responseDate = currentDate.setDate(currentDate.getDate() - 7);

  const topUsersLikes = await UserPostLike.findAll({attributes: ['postId',
  [fn('SUM', col('like')), 'likes']
  , [fn('SUM', col('dislike')), 'dislikes'] 
  ], where: {createdAt: {[Op.gte]: responseDate}
}, include: [{model: Post, attributes: ['userId'], include: [{model: User, attributes: ['id', 'avatar_img', 'username']}]}], group: ['user_post_likes.postId']});

let topUsers = [];

 topUsersLikes.forEach(item => {
   const data = item.dataValues;
   
   const index = topUsers.findIndex(item => item.id === data.post.user.dataValues.id);

   if (index < 0){
    topUsers.push({...data.post.user.dataValues, rate: (data.likes / (data.dislikes + data.likes)) * 100});
   }
  else{
    topUsers[index].rate += (data.likes / (data.dislikes + data.likes)) * 100;
  }
 });

 topUsers.sort((a, b) => a.rate + b.rate);
 
 if (topUsers.length > 5) topUsers.length = 5;

 return topUsers; 

 }

 async getProfileMainData(userId){
  const mainData = await User.findOne({attributes: ['createdAt', 'email', 'username'], where: {id: userId}});
  return mainData;
 }

 async getUserFeedOptions(id){
   
   const feedSubjects = await FeedSubjects.findAll({attributes: [], where: {userId: id}, include: [
    {model: PostSubject, attributes: ['id', 'subject_name']}
   ]});

   const feedCategories = await FeedCategories.findAll({attributes: [], where: {userId: id}, include: [
    {model: Category, attributes: ['id', 'name']}
   ]});

   const feedSettings = await UserFeedSettings.findOne({where: {userId: id}});

   return {subjects: feedSubjects.map(subject => subject = subject.post_subject), 
    categories: feedCategories.map(category => category = category.category), 
    settings: feedSettings};

 }

 async updateFeedSettings(userId, settings){
    
    const { subjects, categories, min_rate, low_decency_user } = settings;

    console.log(settings);

    await UserFeedSettings.update({min_rate, low_decency_user}, {where: {userId}});

    await FeedCategories.destroy({where: {userId}});
    
    await FeedCategories.bulkCreate(categories.map(item => ({categoryId: item.id, userId})));

    await FeedSubjects.destroy({where: {userId}});

    await FeedSubjects.bulkCreate(subjects.map(item => ({userId, postSubjectId: item.id})));

    return await this.getUserFeedOptions(userId);
 }

}


module.exports = new UserService();