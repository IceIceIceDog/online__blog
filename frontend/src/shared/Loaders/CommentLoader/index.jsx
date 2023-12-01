import cl from './CommentLoader.module.scss';


const CommentLoader = () => {
  return (
    <div className={cl.comment__loader}>
    <div className={cl.user}>
    <div className={cl.img}></div>
    <span className={cl.username}></span>
    <span className={cl.date}></span>
    </div>
    <div className={cl.comment}></div>
    <div className={cl.buttons}></div>
    </div>
  )
}

export default CommentLoader;