import cl from './CreatePost.module.scss';
import '../../assets/style/_select.scss';
import PostService from '../../services/PostService';
import CategoryService from '../../services/CategoryService';
import SubjectService from '../../services/SubjectService';
import { useFetching } from '../../hooks/useFetching';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FieldEditor from '../../components/FieldEditor';
import FileUploader from '../../components/FileUploader';
import Select from 'react-select';
import Button from '../../shared/UI/Button';
import PostDedailLoader from '../../shared/Loaders/PostDetailLoader';
import ErrorHandler from '../../shared/UI/ErrorHandler';



const CreatePost = () => {
  
  const user = useSelector(state => state.user.user);

  const redirect = useNavigate();

  const [post, setPost] = useState({title: '', description: '', content: '', categoryId: '', subjectId: [], img: null});

  const [categories, setCategories] = useState([{id: '', name: 'Не выбрано'}]);
  const [subjects, setSubjects] = useState([]);

  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  
  const [isLoading, error, fetchSelectedValues] = useFetching(async () => {
     const categoriesData = await CategoryService.getAll();
     const subjectsData = await SubjectService.getAll();
     setCategories([...categories, ...categoriesData.data]);
     setSubjects(subjectsData);
  });

  const handleCategory = (selectedValue) => {
    setPost({...post, categoryId: selectedValue.id});
  } 

  const handleSubjects = (selectedOption) => {
    setPost({...post, subjectId: selectedOption.map(item => item.id)});
  }

   const handleTitle = (value) => setPost({...post, title: value});

   const handleDescription = (value) => setPost({...post, description: value});

   const handleContent = (value) => setPost({...post, content: value});

   const handleFile = (value) => setPost({...post, img: value});
   
   const cancelCreate = (e) => {
    e.preventDefault();
    redirect(`/profile/${user.id}/posts`);
   }

   const createPost = async (e) => {
   try{
    e.preventDefault();
    const postData = new FormData();
    for (let key of Object.keys(post)){
        postData.append(key, post[key]);
    }

    postData.append('type', 'publicate');
    postData.append('userId', user.id);
    
   
    await PostService.create(postData);
    
    redirect(`/profile/${user.id}/posts`);
   }
   catch(e){
    console.log(e);
   }
   }

   const createCategory = async (e) => {
    try{
      e.preventDefault();
      const newCategory = await CategoryService.create(category);
      setCategories([...categories, newCategory]);
      setPost({...post, categoryId: newCategory.id});
      setCategory(''); 
     
    }
    catch(e){
      console.log(e);
    }
   }

   const createSubject = async (e) => {
    try{
      e.preventDefault();
      const newSubject = await SubjectService.createSubject(subject);
      setSubjects([...subjects, newSubject]);
      setPost({...post, subjectId: [...post.subjectId, newSubject.id]});
      setSubject(''); 
    }
    catch(e){
      console.log(e);
    }
   }

   const getSelectedValue = (options, value) => {
    return options.find(option => option.id === value);
  }

  const getSelectedMultiValues = (options, value, findKey) => {
    if (value.length){
       return options.filter(option => value.indexOf(option[findKey]) >= 0)
    }
    else{
       return [];
    }
}

   useEffect(() => {
     document.title = 'Создание публикации';
     fetchSelectedValues();
     // eslint-disable-next-line
   }, []);


  return (
    <div className={cl.post__wrapper}>
     <h1 className={cl.form__edit__title}>Редактирование публикации</h1>
      <form className={cl.post__edit}>
     {
      isLoading ? <PostDedailLoader /> :
      (error.error || error.errors.length) ? <ErrorHandler />
      :
       (categories.length > 0 && subjects.length > 0) &&  
       <>
       <Select 
       classNamePrefix="custom-select"
       options={categories}
       onChange={handleCategory}
       placeholder = 'Поиск по категориям...'
       getOptionLabel={(option) => option.name}
       getOptionValue={(option) => option.id}
       value={getSelectedValue(categories, post.categoryId)}
       />
       <Select 
       classNamePrefix="custom-select"
       options={subjects}
       onChange={handleSubjects}
       isMulti
       placeholder = 'Поиск по тематике...'
       getOptionLabel={(option) => option.subject_name}
       getOptionValue={(option) => option.id}
       value={getSelectedMultiValues(subjects, post.subjectId, 'id')}
       />
       </>
     }
        <div className={cl.create__options}>
        <FieldEditor title="Своя категория" value={category} changeHandler={setCategory}/>
        <Button onClick={createCategory} style={{padding: "5px 10px"}}>Добавить</Button>
        </div>
        <div className={cl.create__options}>
        <FieldEditor title="Своя тематика" value={subject} changeHandler={setSubject}/>
        <Button onClick={createSubject} style={{padding: "5px 10px"}}>Добавить</Button>
        </div>
        <FieldEditor title="Заголовок" value={post.title} changeHandler={handleTitle}/>
        <FileUploader initialSource={post.img} uploadHandler={handleFile}/>
        <FieldEditor title="Описание" value={post.description} changeHandler={handleDescription}/>
        <FieldEditor title="Содержание" value={post.content} changeHandler={handleContent} type="editor"/>
        <div className={cl.post__edit__buttons}>
       <Button onClick={createPost} style={{padding: '5px 20px'}}>Опубликовать</Button>
       <Button onClick={cancelCreate} style={{padding: '5px 20px'}} styles="inverse">Отмена</Button>
       </div>
      </form>
      </div>
  )
}

export default CreatePost