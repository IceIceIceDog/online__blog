
const sequelize = require('../../database');
const {DataTypes} = require('sequelize');

const User = sequelize.define('users', {
id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
username: {type: DataTypes.STRING, allowNull: false},
password: {type: DataTypes.STRING, allowNull: false},
email: {type: DataTypes.STRING, unique: true, allowNull: false},
avatar_img: {type: DataTypes.STRING},
decency: {type: DataTypes.INTEGER, defaultValue: 10000},
rate: {type: DataTypes.INTEGER, defaultValue: 0},
email_confirmed: {type: DataTypes.BOOLEAN, defaultValue: false},
activation_link: {type: DataTypes.STRING},
});

const Post = sequelize.define('posts', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: false},
    content: {type: DataTypes.TEXT, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: false, defaultValue: process.env.POST_IMAGE_TEMPLATE},
    likes: {type: DataTypes.INTEGER, defaultValue: 0, allowNull: false},
    dislikes: {type: DataTypes.INTEGER, defaultValue: 0, allowNull: false},
    comment: {type: DataTypes.INTEGER, defaultValue: 0, allowNull: false},
    bookmark: {type: DataTypes.INTEGER, defaultValue: 0, allowNull: false},
    rate: {type: DataTypes.INTEGER, defaultValue: 0, allowNull: false},
    views: {type: DataTypes.INTEGER, defaultValue: 0, allowNull: false},
    categoryId: {type: DataTypes.INTEGER, allowNull: false}
});

const Comment = sequelize.define('comments', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    content: {type: DataTypes.TEXT, allowNull: false},
    likes: {type: DataTypes.INTEGER, defaultValue: 0, allowNull: false},
    dislikes: {type: DataTypes.INTEGER, defaultValue: 0, allowNull: false},
});

const Role = sequelize.define('roles', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
});

const Category = sequelize.define('categories', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
});

const Token = sequelize.define('tokens', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    refresh_token: {type: DataTypes.STRING, allowNull: false}
});

const UserCommentLike = sequelize.define('user_comment_likes', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    like: {type: DataTypes.BOOLEAN, defaultValue: false},
    dislike: {type: DataTypes.BOOLEAN, defaultValue: false}
});

const UserPostLike = sequelize.define('user_post_likes', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    like: {type: DataTypes.BOOLEAN, defaultValue: false},
    dislike: {type: DataTypes.BOOLEAN, defaultValue: false}
});

const PostSubject = sequelize.define('post_subjects', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    subject_name: {type: DataTypes.STRING, unique: true, allowNull: false}
});

const SubjectsInPost = sequelize.define('subjects_in_post', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});



const ProcessedPost = sequelize.define('processed_posts', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: false},
    content: {type: DataTypes.TEXT, allowNull: false},
    img: {type: DataTypes.STRING}

});

const PostInBookMark = sequelize.define('posts_in_bookmarks', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},   
});



const UserRoles = sequelize.define('user_roles', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true}
});

const Subscribers = sequelize.define('subscribers', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    subscriberId: {type: DataTypes.INTEGER, allowNull: false}
});

const Messages = sequelize.define('messages', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    content: {type: DataTypes.STRING, allowNull: false},
    type: {type: DataTypes.STRING, allowNull: false},
    href: {type: DataTypes.STRING, allowNull: true},
    hrefContent: {type: DataTypes.STRING, allowNull: true},
    userImage: {type: DataTypes.STRING, allowNull: true},
    defaultImage: {type: DataTypes.BOOLEAN, allowNull: false},
    postImage: {type: DataTypes.STRING, allowNull: true}
});

const FeedSubjects = sequelize.define('feed_subjects', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true}
});

const FeedCategories = sequelize.define('feed_categories', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true}  
});

const UserFeedSettings = sequelize.define('user_feed_settings', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    min_rate: {type: DataTypes.STRING, allowNull: false, defaultValue: 0},
    low_decency_user: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true} 
})

User.hasMany(Post);
Post.belongsTo(User);
User.hasMany(ProcessedPost);
ProcessedPost.belongsTo(User);
User.hasMany(PostInBookMark);
PostInBookMark.belongsTo(User);
User.hasMany(UserRoles);
UserRoles.belongsTo(User);
Role.hasMany(UserRoles);
UserRoles.belongsTo(Role);
Post.hasMany(PostInBookMark);
PostInBookMark.belongsTo(Post);
User.hasOne(Token);
Token.belongsTo(User);
User.hasMany(Comment);
Comment.belongsTo(User);
User.hasMany(Messages);
Messages.belongsTo(User);
User.hasMany(Subscribers);
Subscribers.belongsTo(User);
Category.hasMany(Post);
Post.belongsTo(Category);
Post.hasMany(Comment);
Comment.belongsTo(Post);
User.hasMany(UserPostLike);
UserPostLike.belongsTo(User);
Post.hasMany(UserPostLike);
UserPostLike.belongsTo(Post);
User.hasMany(UserCommentLike);
UserCommentLike.belongsTo(User);
Comment.hasMany(UserCommentLike);
UserCommentLike.belongsTo(Comment);
Post.hasMany(SubjectsInPost);
SubjectsInPost.belongsTo(Post);
PostSubject.hasMany(SubjectsInPost);
SubjectsInPost.belongsTo(PostSubject);
User.hasMany(FeedCategories);
FeedCategories.belongsTo(User);
User.hasMany(FeedSubjects);
FeedSubjects.belongsTo(User);
User.hasOne(UserFeedSettings);
UserFeedSettings.belongsTo(User);
Category.hasMany(FeedCategories);
FeedCategories.belongsTo(Category);
PostSubject.hasMany(FeedSubjects);
FeedSubjects.belongsTo(PostSubject);

module.exports = {
    User,
    Post,
    Role,
    Token,
    Comment,
    Category,
    UserPostLike,
    UserCommentLike,
    PostSubject,
    SubjectsInPost,
    ProcessedPost,
    PostInBookMark,
    UserRoles,
    Messages,
    Subscribers,
    FeedCategories,
    FeedSubjects,
    UserFeedSettings
};