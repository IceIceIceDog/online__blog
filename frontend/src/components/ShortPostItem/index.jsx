import { Link } from 'react-router-dom';
import {FaRegEye, FaRegComment} from 'react-icons/fa6';
import cl from './ShortPostItem.module.scss';

const ShortPostItem = ({post}) => {
  return (
    <div className={cl.top__postitem}>
    <div className={cl.ibg__post}>
      <img src={`http://localhost:7000/${post.img}`} alt={post.title} />
    </div>
    <h3 className={cl.top__postitem__title}><a href={`/posts/${post.id}`}>{post.title}</a></h3>
    <div className={cl.top__postitem__buttons}>
    <span className={cl.icon__button}>{post.views} <FaRegEye /></span>
    <span className={cl.icon__button}><Link to={`/posts/${post.id}#comments`}>{post.comment} <FaRegComment /></Link></span>
    </div>
    </div>
  )
}

export default ShortPostItem