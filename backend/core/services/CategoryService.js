const {Category} = require('../models/models');

class CategoryService{
    async createCategory(categoryName){
      const category = await Category.create({name: categoryName});
      return category;
    }

    async getAll(){
        const categories = await Category.findAll();
        return categories;
    }

    async getOne(categoryId){
        const category = Category.findByPk(categoryId);
        return category;
    }

    async updateCategory(categoryData){
        const updatedCategory = await Category.update({...categoryData});
        return updatedCategory;
    }

    async deleteCategory(categoryId){
        const deletedCategory = await Category.destroy({where:{id: categoryId}});
        return deletedCategory;
    }
}

module.exports = new CategoryService();