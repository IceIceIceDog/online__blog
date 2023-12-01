import apiService from '../api';

export default class SubjectService{
    static async getAll(){
        const subjects = await apiService.get('/posts/subjects');
        return subjects.data;
    }
    static async createSubject(name){
        const subject = await apiService.post('posts/subjects/add', {subject_name: name});
        return subject.data;
    }
    static async deleteSubjects(subjectId){
        const deletedSubject = await apiService.delete('/posts/subjects/delete', {data: {subjectId}});
        return deletedSubject.data;
    }
}