import cl from './PostLoader.module.scss';

const PostLoader = () => {
  return (
    <div className={cl.post__loader}>
    <div className={cl.post__loader__header}>
    <div className={cl.user}>
    <div className={cl.img}></div>
    <span className={cl.name}></span>
    <span className={cl.name}></span>
    </div>
    <span className={cl.header__left}></span>
    </div>
    <div className={cl.post__title}></div>
    <div className={cl.post__content}></div>
    <div className={cl.post__footer}>
    <div className={cl.left__side}></div>
    <div className={cl.right__side}></div>
    </div>
    </div>
  )
}

export default PostLoader