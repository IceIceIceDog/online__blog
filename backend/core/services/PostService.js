
const APIError = require('../errors/APIError');
const {ProcessedPost, Post, UserPostLike, SubjectsInPost, PostInBookMark, User, Subscribers, PostSubject, FeedCategories, FeedSubjects, UserFeedSettings, Category, Messages} = require('../models/models');
const FileService = require('./FileService');
const {Op} = require('sequelize');



class PostService{
    async getAll(options){

    if (options.hasOwnProperty('search') && !options.search) return {rows: [], count: 0};

    const query = this.createQuery(options);  

    const posts = await Post.findAndCountAll(query);
    
    return posts;
    
    }

    async getOne(id, currentUserId){
        const options = {where: {id}, include: [
            {model: User, attributes: ['id', 'username', 'avatar_img']},
            {model: SubjectsInPost}
        ]};

        await Post.increment('views', {where: {id}});

        if (currentUserId !== '') {
            options.include = [...options.include, 
            {model: UserPostLike, where: {userId: currentUserId}, required: false},
            {model: PostInBookMark, attributes: ['id'], where: {userId: currentUserId}, required: false}
        ];

        options.include[0].include = {model: Subscribers, attributes: ['id'], where: {subscriberId: currentUserId}, required: false};
    }

        const post = await Post.findOne(options);

        return post;
    }

    async getPostsFromCategory(categoryId){
         const postsFromCategory = await Post.findAll({where: {categoryId}});
         return postsFromCategory;
    }

    async addPost(title, description, content, userId, categoryId, img, type, subjectsId){
        
        if (!userId) throw APIError.badRequest('Некорректные данные');
        if (subjectsId) subjectsId = subjectsId.split(',');
        if (subjectsId?.length > 5) throw APIError.badRequest('Количество тегов на одной публикации не должно превышать пяти');
        let imgName = '';
        if(img) imgName = FileService.uploadPostImage(img);
        else imgName = process.env.POST_IMAGE_TEMPLATE;
         switch(type){
            case "moderation":
            return await ProcessedPost.create({title, description, content, userId, categoryId, img: imgName});
            case "publicate":
            const post = await Post.create({title, description, content, userId, categoryId, img: imgName});
            subjectsId = subjectsId.map(subjectId => ({postSubjectId: subjectId, postId: post.id}));
            await SubjectsInPost.bulkCreate(subjectsId);
            return post;
            default:
            throw APIError.badRequest('Некорректные данные');
         }
    }

    async updatePost(postData, image){
       if (image) {
        let oldImage = '';
        const post = await Post.findByPk(postData.id);
        if (post.img) {
            oldImage = post.img;
            if (post.img !== process.env.POST_IMAGE_TEMPLATE) FileService.deleteUploadedImage(post.img);
        }
        const newImage = FileService.uploadPostImage(image);
        await Post.update({...postData, img: newImage}, {where: {id: postData.id}});
        await Messages.update({postImage: newImage}, {where: {type: 'post', postImage: oldImage}});
        
        const updatedPost = await Post.findByPk(postData.id);
        return updatedPost;
       }
       
       await Post.update({...postData}, {where: {id: postData.id}});
       const updatedPost = await Post.findByPk(postData.id);
       return updatedPost;
       
    }

    async deletePost(id){
        const deletedImgPath = await Post.findByPk(id, {attributes: ['img']});
        if (deletedImgPath) FileService.deleteUploadedImage(deletedImgPath.img);
        const deletedPost = await Post.destroy({where: {id}});
        return deletedPost;
    }

    async InsertImage(postImage = null){
        if (postImage) {
            const newImage = FileService.uploadPostImage(postImage);
            return {uploaded: true, url: process.env.API_URL + '/' + newImage}
        }

        throw APIError.badRequest('Нет изображения');
    }

    async getTop(){
        
        const currentDate = new Date();

        const responseDate = currentDate.setDate(currentDate.getDate() - 7);

        const topArticles = await Post.findAll({where: {createdAt: {[Op.gte]: responseDate}}, order: [['rate', 'DESC']], limit: 5});
        
        if (!topArticles.length) {
            
            return await Post.findAll({ order: [['rate', 'DESC'], ['createdAt', 'DESC']], limit: 5 });
        }

        return topArticles;
    }

    async getUserFeed(id, options){
       
        let feedSubjectIds = await PostSubject.findAll({attributes: ['id'], include: [
            {model: FeedSubjects, attributes: [], where: {userId: id}}
        ]});

        let feedCategoryIds = await Category.findAll({attributes: ['id'], include: [
            {model: FeedCategories, attributes: [], where: {userId: id}}
        ]});

        let subscribersIds = await Subscribers.findAll({where: {subscriberId: id}});

        const feedSettings = await UserFeedSettings.findOne({where: {userId: id}});

        feedSubjectIds = feedSubjectIds.map(item => item = item.id);
        feedCategoryIds = feedCategoryIds.map(item => item = item.id);
        subscribersIds = subscribersIds.map(item => item = item.userId);

        let includeInPosts = [
            {model: User, attributes: ['id', 'username', 'avatar_img'], where: {decency: {[Op.gte]: feedSettings.low_decency_user ? 0 : 4000}}},
            {model: SubjectsInPost, 
                include: [{model: PostSubject, attributes: ['subject_name']}]}
        ];

        if (options.userId){
            includeInPosts = [...includeInPosts, 
                {model: UserPostLike, where: {userId: options.userId}, required: false},
                {model: PostInBookMark, attributes: ['id'], where: {userId: options.userId}, required: false}
            ]
        }

       const postsIdFilterWithCategory = await Post.findAll({attributes: ['id'], where: {rate: {[Op.gte]: feedSettings.min_rate}, categoryId: {[Op.in]: feedCategoryIds}}});
       
       const postsIdFilterWithSubjects = await SubjectsInPost.findAll({attributes: ['postId'], where: {postSubjectId: {[Op.in]: feedSubjectIds}}, include: [
        {model: Post, attributes: [], where: {rate: {[Op.gte]: feedSettings.min_rate}}}
       ]});

       const postIdFilterWithSubcribes = await Post.findAll({attributes: ['id'], include: [
        {model: User, attributes: [], where: {id: {[Op.in]: subscribersIds}}}
       ]});

       const feedPostsId = Array.from(new Set([
        ...postsIdFilterWithCategory.map(item => item = item.id),
        ...postsIdFilterWithSubjects.map(item => item = item.postId),
        ...postIdFilterWithSubcribes.map(item => item = item.id)
    ]));

       const feedPosts = await Post.findAndCountAll({where: {id: {[Op.in]: feedPostsId}}, include: [
        ...includeInPosts
       ], distinct: true});

       return feedPosts;

      
    }

    createQuery(options){
        
        const query = {where: {}, include: [], order: [], distinct: true};
        if (options.authorId){
            query.include = [...query.include, {model: User, attributes: ['avatar_img', 'username'], where: {id: options.authorId}}];
        }
        else{
            query.include = [...query.include, {model: User, attributes: ['avatar_img', 'username']}];
        }
        
        if (options.userId){
            query.include = [...query.include, 
                {model: UserPostLike, where: {userId: options.userId}, required: false},
                {model: PostInBookMark, attributes: ['id'], where: {userId: options.userId}, required: false}
            ];
        }
        if (options.categories){
            query.where = {...query.where, categoryId: {[Op.in]: options.categories.split(',')}};
        }

        if (options.rate){
           switch(options.rate){
            case 'ASC':
             query.order = [...query.order, ['rate', 'ASC']];
             break;
             case 'DESC':
             query.order = [...query.order, ['rate', 'DESC']];
             break;
             case 'more25':
                query.where = {...query.where, rate: {[Op.gte]: 25}};
             break;
             case 'more50':
                query.where = {...query.where, rate: {[Op.gte]: 50}};
             break;
             case 'more75':
                query.where = {...query.where, rate: {[Op.gte]: 75}};
             break;
             case 'max':
                query.where = {...query.where, rate: 100};
             break;
             default:
             break;
           }
        }

        if (options.date){
            const order = options.date === 'ASC' ? 'ASC': 'DESC';
            query.order = [...query.order, ['createdAt', order]];
        }

        if (options.subjects){
            query.include = [...query.include, {model: SubjectsInPost, 
            include: [{model: PostSubject, attributes: ['subject_name']}],    
            where: {postSubjectId: {[Op.in]: options.subjects.split(',')}}}];
        }
        else{
            query.include = [...query.include, {model: SubjectsInPost, 
            include: [{model: PostSubject, attributes: ['subject_name']}]}];    
        }

        if (options.popular){
            const order = options.popular === 'ASC' ? 'ASC' : 'DESC';
            query.order = [...query.order, ['views', order]];
        }
        
        if (options.limit){
            query.limit = +options.limit;
        }

        if (options.offset){
            query.offset = +options.offset * +options.limit;
        }

        if (options.search) query.where = {...query.where, title: {[Op.substring]: options.search}};
       
        return query;
    }
}

module.exports = new PostService();