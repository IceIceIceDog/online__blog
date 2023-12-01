import cl from './PostLoader.module.scss';
import UserLoader from '../UserLoader';

const PostDetailLoader = () => {
  return (
    <div className={cl.loader__wrapper}>
     <div className={cl.loader__header}>
    <UserLoader />
     </div>
     <div className={cl.loader__subjects}>
     <span></span>
     <span></span>
     <span></span>
     </div>
     <div className={cl.loader__title}></div>
     <div className={cl.loader__img}></div>
     <div className={cl.loader__content}></div>
    </div>
  )
}

export default PostDetailLoader