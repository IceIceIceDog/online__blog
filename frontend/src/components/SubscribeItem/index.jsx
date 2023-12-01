import cl from './SubscribeItem.module.scss';
import { Link } from 'react-router-dom';
import { FaRegStar, FaFaceSmile } from 'react-icons/fa6';
import { motion } from 'framer-motion';

const SubscribeItem = ({subscribe}) => {

  const getDecencyStyle = decency => {
    if (decency <= 5000) return [cl.statistic__item, cl.bad].join(' ');
    if (decency > 5000 && decency <= 7500) return [cl.statistic__item, cl.normal].join(' ');
    if (decency > 7500) return [cl.statistic__item, cl.good].join(' ');
} 


  return (
    <motion.div 
    initial={{opacity: 0, y: -15}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.3}}
    exit={{opacity: 0, y: -15}}
      className={cl.subscribe__item}>
      <div className={cl.user__info}>
      <div className={cl.ibg__user}>
        <img src={`http://localhost:7000/${subscribe.avatar_img}`} alt={subscribe.username} />
      </div>
      <span className={cl.username}><Link to={`/profile/${subscribe.id}`}>{subscribe.username}</Link></span>
      </div>
      <div className={cl.user__statistic}>
      <span className={cl.statistic__item}>{subscribe.rate} <FaRegStar /></span>
      <span className={getDecencyStyle(subscribe.decency)}>{subscribe.decency} <FaFaceSmile /></span>
      </div>
    </motion.div>
  )
}

export default SubscribeItem