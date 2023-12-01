const { Post, PostSubject, SubjectsInPost } = require('../models/models');

class SubjectService{
    static async getAll(){
        const subjects = await PostSubject.findAll();
        return subjects;
    }
    static async create(subject_name){
        const subject = await PostSubject.create({subject_name});
        return subject;
    }
    static async delete(id){
        const deletedSubjects = await PostSubject.destroy({where: {id}});
        return deletedSubjects;
    }
}

module.exports = SubjectService;