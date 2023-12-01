import { useState, lazy, Suspense } from 'react';
import CircleLoader from '../../../../shared/Loaders/CircleLoader';
import { motion } from 'framer-motion';
import cl from './Settings.module.scss';
const ProfileSettings = lazy(() => import('../ProfileSettings'));
const FeedSettings = lazy(() => import('../FeedSettings'));

const Settings = ({updateUser, initialState}) => {
  
  const [currentTub, setCurrentTub] = useState({profile: true, feed: false});
  
  const handleProfileSettings = () => setCurrentTub({...currentTub, profile: true, feed: false});

  const handleFeedSettings = () => setCurrentTub({...currentTub, profile: false, feed: true});

  



  return (
    <motion.div 
    initial={{opacity: 0, y: -15}}
    animate={{opacity: 1, y: 0}}
    exit={{opacity: 0, y: -15 }}
    transition={{duration: 0.5}}
    className={cl.profile__settings}>
     <div className={cl.settings__tabs}>
     <ul className={cl.settings__tabs__tablist}>
        <li onClick={handleProfileSettings} className={currentTub.profile ? [cl.tablist__item, cl.active].join(' ') : cl.tablist__item}>Общие настройки</li>
        <li onClick={handleFeedSettings} className={currentTub.feed ? [cl.tablist__item, cl.active].join(' ') : cl.tablist__item}>Настройки ленты</li>
     </ul>
     </div>
     <div className={cl.profile__settings__content}>
     {
        currentTub.profile
        ? <Suspense key="profile__settings" fallback={<CircleLoader size={100} />}><ProfileSettings updateUser={updateUser} initialState={initialState} /></Suspense>
        : <Suspense key="feed__settings" fallback={<CircleLoader size={100} />}><FeedSettings /></Suspense>
     }
     </div>
    </motion.div>
  )
}

export default Settings