import CommentItem from '../CommentItem';
import cl from './PostComments.module.scss';
import Button from '../../shared/UI/Button';
import Input from '../../shared/UI/Input';
import Pagination from '../Pagination';
import { useState, useEffect } from 'react';
import { usePagination } from '../../hooks/usePagination';
import { useFetching } from '../../hooks/useFetching';
import CommentService from '../../services/CommentService';
import UserService from '../../services/UserService';
import { useSelector } from 'react-redux';


const PostComments = ({postId}) => {

  const [comment, setComment] = useState('');
  
  const [comments, setComments] = useState({data: [], count: null});

  const [paginationSettings, setPaginationSettings] = useState({limit: 20, offset: 0});

  const user = useSelector(state => state.user.user);

  const [isLoading, error, fetchComments] = useFetching(async () => {
     const postComments =  await CommentService.getAllPostComments(postId, paginationSettings.limit, paginationSettings.offset);
     setComments({...comments, data: postComments.data.rows, count: postComments.data.count});
  });

  const pages = usePagination(comments.count, paginationSettings.limit, paginationSettings.offset);
 
  const clearInput = (e) => {
    e.preventDefault();
    setComment('');
  }

  const likeComment = async (commentId, like) => {
    try{
      const likeData = await UserService.setCommentLike(commentId, user.id, like);
      const newCommentsState = [...comments.data];
      const index = newCommentsState.findIndex(comm => comm.id === commentId);
      
      newCommentsState[index].likes = likeData.likes;
      newCommentsState[index].dislikes = likeData.dislikes;
      newCommentsState[index].user_comment_likes[0] = { ...newCommentsState[index].user_comment_likes[0],
       like: likeData.commentLikeState.like,
       dislike: likeData.commentLikeState.dislike
      };
      setComments({...comments, data: newCommentsState}); 
    }
    catch(e){
      console.log(e);
    }
  }

  const addComment = async (e) => {
    try{
      e.preventDefault();
      const newComment = await CommentService.addComment({commentContent: comment, userId: user.id, postId});
      setComments({...comments, data: [...comments.data, {...newComment, user_comment_likes: []}], count: comments.count + 1});
      setComment('');
    }
    catch(e){
      console.log(e);
    }
  }

  const updateComment = async (content, commentId) => {
     try{
      await CommentService.updateComment(commentId, content);
      const newCommentState = [...comments.data];
      const index = newCommentState.findIndex(comm => comm.id === commentId);
      newCommentState[index].content = content;
      setComments({...comments, data: newCommentState});
     }
     catch(e){
      console.log(e);
     }
  }

  const removeComment = async (commentId) => {
    try{
        const deletedComment = await CommentService.deleteComment(commentId);
        setComments(prev => ({...prev, data: comments.data.filter(comm => comm.id !== deletedComment), count: comments.count - 1}));
    }
    catch(e){
      console.log(e);
    }
  }

  const handlePage = offset => setPaginationSettings({...paginationSettings, offset});

  useEffect(() => {
     fetchComments();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationSettings]);

  

  return (
    <div className={cl.post__comments} id='comments'>
      <div className={cl.comments__header}>
      <h2 className={cl.comments__header__title}>Комментарии ({comments.count})</h2>
      <div className={cl.add__comment}>
      <form className={cl.comments__form}>
      <Input value={comment} 
      changeHandler={setComment} 
      placeholder="Оставьте комментарий..." 
      type="textarea" />
      <div className={cl.comments__form__buttons}>
        <Button onClick={addComment} style={{padding: "10px 30px"}} >Добавить</Button>
        <Button styles="inverse" style={{padding: "10px 30px"}} onClick={clearInput}>Отмена</Button>
      </div>
      </form>
      </div>
      </div>
      <div className={cl.comments__list}>
        {
            
          isLoading ? <h2>Загрузка...</h2> 
           : (error.error || error.errors.length) ? <h2>Внутренняя ошибка сервера</h2>
           : comments.data.map(comm => <CommentItem key={comm.id}
             comment={comm}
             likeComment={likeComment}
             removeComment={removeComment}
             updateComment={updateComment}
            />)    
        }
      </div>
      {
        pages.length > 1 && <Pagination pages={pages} handlePage={handlePage} currentPage={paginationSettings.offset} />
      }
    </div>
  )
}

export default PostComments