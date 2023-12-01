
import { memo } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import cl from './PostItem.module.scss';
import {FaRegEye, FaRegThumbsUp, FaRegThumbsDown, FaBookmark, FaRegComment} from 'react-icons/fa6';
import SubjectItem from '../SubjectItem';
import { getDateFormat } from '../../shared/Helpers/getDateFormat';
import Button from '../../shared/UI/Button';
import { motion } from 'framer-motion';
import useResize from '../../hooks/useResize';

const PostItem = ({post, likeHandler, bookmarkHandler, selectSubject = null}) => {

const redirect = useNavigate();

const currentWidth = useResize();

const readmoreHandler = () => redirect(`/posts/${post.id}`);

const {user, user_post_likes, posts_in_bookmarks, subjects_in_posts} = post;

const handleBookmark = () => {
  if (posts_in_bookmarks?.length && posts_in_bookmarks[0].id) bookmarkHandler(post.id, 'delete', posts_in_bookmarks[0].id);
  else bookmarkHandler(post.id, 'add');
}

const setLike = () => likeHandler(post.id, 'like');

const setDislike = () => likeHandler(post.id, 'dislike');

  return (
    <motion.div
    key={post.id} 
    initial={{opacity: 0, y: -15}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.3}}
    exit={{opacity: 0, y: -15}}
    className={cl.post__item}>
    <div className={cl.post__header}>
      <div className={cl.user}>
      <Link to={`/profile/${post.userId}`}>
      <div className={cl.ibg__user}>
        <img src={`http://localhost:7000/${user.avatar_img}`} alt={user.username} />
      </div>
      </Link>
      <span className={cl.username}><Link to={`/profile/${post.userId}`}>{user.username}</Link></span>
      </div>
      <span className={cl.post__date}>{getDateFormat(new Date(post.createdAt))}</span>
      {currentWidth > 450 && <span className={cl.post__views}>{post.views} <FaRegEye /></span>}
    </div>
    <div className={cl.post__info}>
    {currentWidth < 450 && <span className={cl.post__views}>{post.views} <FaRegEye /></span>}
    <div className={cl.post__tags}>
      {
        subjects_in_posts?.map(subject => <SubjectItem 
          key={subject.id} 
          subject={subject}
          classNames={cl.post__tags__item} 
          selectSubject={selectSubject}
          />)
      }
    </div>
    </div>
    <div className={cl.post__content}>
      <h1 className={cl.post__title}><Link to={`/posts/${post.id}`}>{post.title}</Link></h1>
      <div className={cl.ibg__post}>
        <img src={`http://localhost:7000/${post.img}`} alt="Изображение публикации"/>
      </div>
     <p className={cl.post__description}>{post.description}</p>
    </div>
    <div className={cl.post__buttons}>
    <div className={cl.buttons__leftside}>
    <button onClick={setLike} className={cl.icon__button}>
      <span className={user_post_likes?.length  && user_post_likes[0].like ? cl.liked : null}>{post.likes} <FaRegThumbsUp /></span>
    </button>
    <button onClick={setDislike} className={cl.icon__button}>
      <span className={user_post_likes?.length && user_post_likes[0].dislike ? cl.disliked : null}>{post.dislikes} <FaRegThumbsDown /></span>
    </button>
    <button onClick={handleBookmark} className={cl.icon__button}>
      <span className={posts_in_bookmarks?.length && posts_in_bookmarks[0].id ? cl.bookmarked : null}>{post.bookmark} <FaBookmark /></span>
    </button>
    <button onClick={() => redirect(`/posts/${post.id}#comments`)} className={cl.icon__button}>
     <span>{post.comment} <FaRegComment /></span>
    </button>
    </div>
    <Button onClick={readmoreHandler} style={{padding: '5px 10px'}}>Читать далее</Button>
    </div>
    </ motion.div>
  )
}

export default memo(PostItem);