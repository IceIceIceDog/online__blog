import cl from './Profile.module.scss';

const ProfileLoader = () => {
  return (
    <div className={cl.profile__loader}>
    <div className={cl.user__data}>
    <div className={cl.user}>
    <div className={cl.user__avatar}>
        <div className={cl.ibg__user}>
        
        </div>
    <span></span>
    </div>
    <div className={cl.user__statistic}>
    <span className={cl.username}></span>
    <div className={cl.user__statistic__info}>
    <span></span>
    <span></span>
    </div>
    </div>
     </div>
    </div>
    <div className={cl.profile__navbar}></div>
    </div>
  )
}

export default ProfileLoader