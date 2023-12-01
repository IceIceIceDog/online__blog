import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useFetching } from '../../hooks/useFetching';
import { useSelector } from 'react-redux';
import PostService from '../../services/PostService';
import FieldEditor from "../../components/FieldEditor";
import FileUploader from "../../components/FileUploader";
import PostDetailLoader from '../../shared/Loaders/PostDetailLoader';
import Button from '../../shared/UI/Button';
import Message from '../../shared/UI/Message';
import NotFound from '../../shared/UI/NotFound';
import Forbidden from '../../shared/UI/Forbidden';
import cl from './EditPost.module.scss';

const EditPost = ({postId}) => {

const user = useSelector(state => state.user.user);

const [post, setPost] = useState({title: '', description: '', content: '', img: '', userId: '', id: ''});

const [isLoading, error, fetchPost] = useFetching(async () => {
   const postData = await PostService.getOne(postId);
   const { title, description, content, img, userId, id } = postData.data;
   setPost({...post, title, description, content, img, userId, id});
});

const [messageVisible, setVisible] = useState(false);

const [image, setImage] = useState(null);

const redirect = useNavigate();


const updatePost = async (e) => {
  try{
    e.preventDefault();
    const postData = new FormData();
    for (let key of Object.keys(post)){
      postData.append(key, post[key]);
    }
    if (image) postData.append('image', image);

    const updatedData = await PostService.updatePost(postData);

    const {title, description, img, content, userId, id} = updatedData.data;

    setPost({...post, title, description, img, content, userId, id});
    
    setVisible(true);
  }
  catch(e){
    console.log(e);
  }
}

const titleHandler = (value) => setPost({...post, title: value});

const descriptionHandler = (value) => setPost({...post, description: value});

const contentHandler = (content) => setPost({...post, content});

const cancelUpdate = (e) => {
  document.title = "Редактирование публикации";
  e.preventDefault();
  redirect(`/posts/${postId}`);
}

useEffect(() => {
 fetchPost();
 //eslint-disable-next-line
}, []);

  return (
    <div className={cl.post__wrapper}>
      {
        post.userId === user.id ?
        <>
      {
        isLoading ? <PostDetailLoader />
        : (error.error || error.errors.length) ? <h1>произошла ошибка</h1>
        :post.id ? <>
        <h1 className={cl.form__edit__title}>Редактирование публикации</h1>
        <form className={cl.post__edit}>
        <FieldEditor title="Заголовок" value={post.title} changeHandler={titleHandler}/>
        <FileUploader initialSource={post.img} uploadHandler={setImage}/>
        <FieldEditor title="Описание" value={post.description} changeHandler={descriptionHandler}/>
        <FieldEditor title="Содержание" value={post.content} changeHandler={contentHandler} type="editor"/>
        <div className={cl.post__edit__buttons}>
       <Button onClick={updatePost} style={{padding: '5px 20px'}}>Обновить</Button>
       <Button onClick={cancelUpdate} style={{padding: '5px 20px'}} styles="inverse">Отмена</Button>
       </div>
       </form>
        </>
        : <NotFound />
       }
       {
        messageVisible && <Message 
        message="Публикация обновлена" 
        isVisible={messageVisible} 
        handleIsVisible={setVisible} 
        delay={2000}/>
       }
       </>
       :
       <Forbidden message="Вы не являетесь автором данной публикации" />
      }
    </div>
  )
}

export default EditPost;

