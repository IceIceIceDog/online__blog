import apiService from '../api';

export default class CategoryService{
    static async getAll(){
        const categories = await apiService.get('/categories');
        return categories;
    }

    static async create(name){
        const category = await apiService.post('/categories/create', {name});
        return category.data;
    }
}