import cl from './CommentItem.module.scss';
import { getDateFormat } from '../../shared/Helpers/getDateFormat';
import { FaRegThumbsUp, FaRegThumbsDown, FaPencil, FaTrash, FaCheck, FaXmark } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../shared/UI/Input';
import { motion } from 'framer-motion';

const CommentItem = ({comment, removeComment, likeComment, updateComment }) => {


  const [updatedComment, setUpdatedComment] = useState(comment.content);

  const [editing, setEditing] = useState(false);
  
  const currentUser = useSelector(state => state.user.user);
  
  const {user, user_comment_likes} = comment;

  const removeHandler = () => removeComment(comment.id);

  const likeHandler = () => likeComment(comment.id, "like");

  const dislikeHandler = () => likeComment(comment.id, "dislike");

  const startEdit = () => setEditing(true);

  const closeEdit = (e) => {
    e.preventDefault();
    setEditing(false);
    setUpdatedComment(comment.content);
  }

  const HandleUpdateComment = (e) => {
    e.preventDefault();
    updateComment(updatedComment, comment.id);
    setEditing(false);
  }

 
  return (
    <motion.div 
    initial={{opacity: 0, y: -15}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.3}}
    exit={{opacity: 0, y: -15}}
    className={cl.comment__item} id={comment.id}>
    <div className={cl.comment__header}>
    <div className={cl.comment__user}>
    <div className={cl.ibg__user}>
       <img src={`http://localhost:7000/${user.avatar_img}`} alt={user.username}/>
      </div>
      <span className={cl.username}><Link to={`/profile/${user.id}`}>{user.username}</Link></span>
      <span className={cl.comment__date}>{getDateFormat(new Date(comment.createdAt))}</span>
    </div>
    { currentUser.id === comment.userId && <div className={cl.user__buttons}>
      <button onClick={startEdit} className={editing ? [cl.icon__button, cl.editing].join(' ') : cl.icon__button}><FaPencil /></button>
      <button onClick={removeHandler} className={cl.icon__button}><FaTrash /></button>
      </div>}
    </div>
    <div className={cl.comment__content}>
    {
      editing ? <motion.form 
      initial={{opacity: 0, y: -5}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}
      exit={{opacity: 0, y: -5}}
      className={cl.edit__form}>
      <Input type="textarea" value={updatedComment} changeHandler={setUpdatedComment} />
      <div className={cl.edit__form__buttons}>
        <button onClick={HandleUpdateComment} className={cl.icon__button}><FaCheck /></button>
        <button onClick={closeEdit} className={cl.icon__button}><FaXmark /></button>
      </div>
      </motion.form>
      : <motion.p
      initial={{opacity: 0, y: -5}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}
      exit={{opacity: 0, y: -5}}
      >
        {comment.content}
        </motion.p>
    }
    </div>
    <div className={cl.comment__buttons}>
    <button onClick={likeHandler} className={cl.icon__button}>
      <span className={user_comment_likes?.length && user_comment_likes[0].like ? cl.liked : null}>{comment.likes} <FaRegThumbsUp /></span>
    </button>
    <button onClick={dislikeHandler} className={cl.icon__button}>
      <span className={user_comment_likes?.length && user_comment_likes[0].dislike ? cl.disliked : null}>{comment.dislikes} <FaRegThumbsDown /></span>
    </button>
    </div>
    </motion.div>
  )
}

export default CommentItem

