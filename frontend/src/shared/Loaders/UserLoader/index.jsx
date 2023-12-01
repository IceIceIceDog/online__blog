import cl from './UserLoader.module.scss';

const UserLoader = () => {
  return (
    <div className={cl.user__loader}>
    <div className={cl.user}>
    <div className={cl.img}></div>
    <span className={cl.username}></span>
    </div>
    <div className={cl.buttons}></div>
    </div>
  )
}

export default UserLoader