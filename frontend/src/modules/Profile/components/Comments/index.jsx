import { useState, useEffect, useCallback } from 'react';
import { useFetching } from '../../../../hooks/useFetching';
import { useParams } from 'react-router-dom';
import { useScroll } from '../../../../hooks/useScroll';
import { HashLink } from 'react-router-hash-link';
import { useSelector } from 'react-redux';
import CommentService from '../../../../services/CommentService';
import UserService from '../../../../services/UserService';
import CommentItem from '../../../../components/CommentItem';
import CommentLoader from '../../../../shared/Loaders/CommentLoader';
import FetchDataLoader from '../../../../components/FetchDataLoader';
import ScrollButton from '../../../../shared/UI/ScrollButton';
import NoItems from '../../../../shared/UI/NoItems';
import { FaArrowTurnUp } from 'react-icons/fa6';
import cl from './Comments.module.scss';

const Comments = () => {

  const {id} = useParams();

  const user = useSelector(state => state.user.user);

  const [comments, setComments] = useState({data: [], count: null});

  const [scrollButtonIsVisible, setScrollButtonisVisible] = useScroll(1500);

  const [isLoading, error, fetchData] = useFetching(async () => {
    const userComments = await CommentService.getAllUserComments(id);
    setComments({...comments, data: userComments.data.rows, count: userComments.data.count});
  });

  const likeComment = useCallback(async (commentId, like) => {
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
  }, [comments, user.id]);


  const updateComment = useCallback(async (content, commentId) => {
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
 }, [comments]);

  const removeComment = useCallback(async (commentId) => {
    try{
        const deletedComment = await CommentService.deleteComment(commentId);
        setComments({...comments, data: comments.data.filter(comm => comm.id !== deletedComment), count: comments.count - 1}); 
    }
    catch(e){
      console.log(e);
    }
  }, [comments]);

  useEffect(() => {
   fetchData();
   // eslint-disable-next-line
  }, []);


  return (
    <div className={cl.comments__wrapper}>
    <FetchDataLoader 
    data={comments.data}
    loading={isLoading}
    error={error}
    loader={[...new Array(10)].map((_, i) => <CommentLoader key={i} />)}
    noItems={<NoItems type="comment" size={150} message={user.id === +id ? "Вы еще не оставили ни одного комментария" : "Пользователь еще не оставлял комментариев"} />}
    dataItem={(comment) =>  <div key={comment.id} className={cl.comment__item__wrapper}>
    <HashLink className={cl.span__link} smooth to={`/posts/${comment.postId}#${comment.id}`}>Перейти к публикации <FaArrowTurnUp /></HashLink>
    <CommentItem  
    comment={comment} 
    removeComment={removeComment}
    updateComment={updateComment}
    likeComment={likeComment}
    /></div>}
    />
    <ScrollButton isVisible={scrollButtonIsVisible} changevisible={setScrollButtonisVisible} />
    </div>
  )
}

export default Comments;

