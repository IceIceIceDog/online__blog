import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getDateFormat } from "../../shared/Helpers/getDateFormat";
import { FaRegEye, FaRegThumbsUp, FaRegThumbsDown, FaBookmark } from "react-icons/fa6";
import Button from '../../shared/UI/Button';
import cl from './PostDetail.module.scss';



const PostDetail = ({post, handleLike, deleteHandler, handleBookmark, subscribe, unsubscribe}) => {

  const navigate = useNavigate();
  
  const {user, user_post_likes, posts_in_bookmarks} = post;


  const currentUser = useSelector(state => state.user.user);

  const likeHandler = () => handleLike('like');

  const dislikeHandler = () => handleLike('dislike');

  const deletePost = () => {
    deleteHandler();
    navigate(`/profile/${user.id}/posts`);
  }

  const bookmarkHandler = () => {
    if (posts_in_bookmarks?.length && posts_in_bookmarks[0].id) handleBookmark(post.id, 'delete', posts_in_bookmarks[0].id);
    else handleBookmark(post.id, 'add');
  }

 
 
  return (
    <div className={cl.post__body}>
      {
         currentUser.id === user.id && <div className={cl.edit__post}>
           <h2 className={cl.edit__post__title}>Вы являетесь автором публикации</h2>
          <div className={cl.edit__post__buttons}>
          <Button style={{padding: '5px 10px'}} onClick={() => navigate(`/posts/${post.id}/edit`)}>Редактировать</Button>
          <Button styles='inverse' style={{padding: '5px 35px'}} onClick={deletePost}>Удалить</Button>
          </div>
          </div>
      }
    <div className={cl.post__header}>
    <div className={cl.post__user}>
    <Link to={`/profile/${user.id}`}>
    <div className={cl.ibg__user}>
       <img src={`http://localhost:7000/${user.avatar_img}`} alt={user.username} />
      </div>
      </Link>
      <span className={cl.username}><Link to={`/profile/${user.id}`}>{user.username}</Link></span>
      <span className={cl.post__date}>{getDateFormat(new Date(post.createdAt))}</span>
    </div>
    {
     currentUser.id !== user.id && (user.subscribers?.length && user.subscribers[0].id ? <Button onClick={unsubscribe} style={{padding: '10px 5px'}}>Отписаться</Button>
      : <Button onClick={subscribe} style={{padding: '10px 5px'}}>Подписаться</Button>)
    }
    </div>
    <div className={cl.post__info}>
    <span className={cl.post__views}>{post.views} <FaRegEye /></span>
    <div className={cl.post__tags}>
    <span className={cl.post__tags__item}>Программирование</span>
    <span className={cl.post__tags__item}>DevOps</span>
    <span className={cl.post__tags__item}>Computer science</span>
    </div>
    </div>
    <div className={cl.post__main}>
    <h1 className={cl.post__title}>{post.title}</h1>
    <div className={cl.ibg__post}>
    <img src={`http://localhost:7000/${post.img}`} alt={post.title} />
    </div>
    <div dangerouslySetInnerHTML={{__html: post.content}} className={cl.post__content} />
    </div>
    <div className={cl.post__buttons}>
    <button onClick={likeHandler} className={cl.icon__button}>
      <span className={user_post_likes?.length && user_post_likes[0].like ? cl.liked : null}>{post.likes} <FaRegThumbsUp /></span>
    </button>
    <button onClick={dislikeHandler} className={cl.icon__button}>
      <span className={user_post_likes?.length && user_post_likes[0].dislike ? cl.disliked : null}>{post.dislikes} <FaRegThumbsDown /></span>
    </button>
    <button onClick={bookmarkHandler} className={cl.icon__button}>
      <span className={posts_in_bookmarks?.length && posts_in_bookmarks[0].id ? cl.bookmarked : null}>{post.bookmark} <FaBookmark /></span>
    </button>
    </div>
    </div>
  )
}


  
export default PostDetail;