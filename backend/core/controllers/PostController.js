const PostService = require('../services/PostService');
const CommentService = require('../services/CommentService');
const TokenService = require('../services/TokenService');
const SubjectService = require('../services/SubjectService');
const events = require('events');
const emmiter = new events.EventEmitter();


class PostController{
    async getNewPosts(req, res, next){
        try{
           res.writeHead(200, {
            'Connection': 'keep-alive',
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache'
           });
           emmiter.on('newPost', (post) => {
            res.write(`data: ${JSON.stringify(post)} \n\n`)
           })
        }
        catch(e){
            next(e);
        }
    }

    async getAll(req, res, next){
        try{
           const authorizationHeader = req.headers.authorization;
           const options = req.query;
           if (authorizationHeader){
                const user = TokenService.validateAccessToken(authorizationHeader.split(' ')[1]);
                if (user) options.userId = user.id;
             }
           const posts = await PostService.getAll(options);
           res.status(200).json(posts); 
           }   
        catch(e){
            next(e);
        }
    }
    

    async getOne(req, res, next){
        try{
           const authorizationHeader = req.headers.authorization;
           let userId = '';
           if (authorizationHeader){
            const user = TokenService.validateAccessToken(authorizationHeader.split(' ')[1]);
            if (user) userId = user.id;
         }
           const postId = req.params.id;
           const post = await PostService.getOne(postId, userId);
           res.status(200).json(post);
        }
        catch(e){
            next(e);
        }
    }

    async addPost(req, res, next){
        try{
            const {title, description, content, userId, categoryId, type, subjectId} = req.body;
            let img = null;
            if (req.files?.img) img = req.files.img;
            const newPost = await PostService.addPost(title, description, content, userId, categoryId, img, type, subjectId);
            //emmiter.emit('newPost', newPost);
           res.status(200).json(newPost);
        }
        catch(e){
            next(e);
        }
    }

    

    async getPostsFromCategory(req, res, next){
        try{
           const {categoryId} = req.params.categoryAlias;
           const postsFromCategory = await PostService.getPostsFromCategory(categoryId);
           res.status(200).json(postsFromCategory);
        }
        catch(e){
            next(e);
        }
    }

    async updatePost(req, res, next){
        try{
            
           let image = '';
           
           if (req.files) image = req.files.image;

           const post = req.body;

           const updatedPost = await PostService.updatePost(post, image);
           res.status(200).json(updatedPost);

           
        }
        catch(e){
            next(e);
        }
    }

    async deletePost(req, res, next){
        try{
          const {id} = req.body;
          const deletedPost = await PostService.deletePost(id);
          res.status(200).json(deletedPost);   
        }
        catch(e){
            next(e);
        }
    }

    async getAllPostComments(req, res, next){
        try{ 
            const authorizationHeader = req.headers.authorization;
           let userId = '';
           if (authorizationHeader){
            const user = TokenService.validateAccessToken(authorizationHeader.split(' ')[1]);
            if (user) userId = user.id;
         }
           const postId = req.params.id;
           const {limit, offset} = req.query;
           const postComments = await CommentService.getAllPostComments(postId, userId, limit, offset);
           res.status(200).json(postComments); 
        }
        catch(e){
            next(e);
        }
    }

    async InsertImage(req, res, next){
       try{
          const {upload} = req.files;
          const imageURL = await PostService.InsertImage(upload);
          res.status(200).json(imageURL); 
          
       }
       catch(e){
        console.log(e);
        next(e);
       }
    }

    async getTop(req, res, next){
       try{
           const topArticles = await PostService.getTop();
           res.status(200).json(topArticles);
       }
       catch(e){
        next(e);
       }
    }

    async addSubject(req, res, next){
        try{
           const { subject_name } = req.body;
           const subject = await SubjectService.create(subject_name);
           res.status(200).json(subject);
        }
        catch(e){
            next(e);
        }
    }

    async getAllSubjects(req, res, next){
        try{
            const subjects = await SubjectService.getAll();
            res.status(200).json(subjects);
         }
         catch(e){
             next(e);
         }
    }

    async deleteSubjects(req, res, next){
        try{
            const { subjectId } = req.body
            const deletedSubjects = await SubjectService.delete(subjectId);
            res.status(200).json(deletedSubjects);
         }
         catch(e){
             next(e);
         }
    }

}

module.exports = new PostController();