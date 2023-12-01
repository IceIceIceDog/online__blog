
const CategoryService = require('../services/CategoryService');

class CategoryController{
    async create(req, res, next){
       try{
         const { name } = req.body;
         console.log(name)
         const category = await CategoryService.createCategory(name);
         res.status(200).json(category); 
       }
       catch(e){
        next(e);
       }
    }

    async getAll(req, res, next){
        try{
            const categories = await CategoryService.getAll();
            res.status(200).json(categories);
        }
        catch(e){
         next(e);
        }
    }

    async getOne(req, res, next){
        try{
          const {id} = req.body;
          const category = await CategoryService.getOne(id);
          res.status(200).json(category);
        }
        catch(e){
         next(e);
        }
    }

    async delete(req, res, next){
        try{
            const {id} = req.body;
            const category = await CategoryService.deleteCategory(id);
            res.status(200).json(category); 
        }
        catch(e){
         next(e);
        }
    }

    async update(req, res, next){
        try{
           const {categoryData} = req.body;
           const updateResult = await CategoryService.updateCategory(categoryData);
           res.status(200).json(updateResult);
        }
        catch(e){
         next(e);
        }
    }
}

module.exports = new CategoryController();