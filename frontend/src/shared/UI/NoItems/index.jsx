import cl from './NoItems.module.scss';
import { ReactComponent as Search } from '../../../assets/images/search.svg';
import { ReactComponent as Message } from '../../../assets/images/message.svg';
import { ReactComponent as User } from '../../../assets/images/user.svg';
import { ReactComponent as Comment } from '../../../assets/images/comment.svg';
import { motion } from 'framer-motion';

const NoItems = ({type, message, size = null}) => {

 const getContent = () => {
    switch (type){
        case 'search':
            return <Search />
        case 'comment':
            return <Comment />
        case 'subscribe':
            return <User />
        case 'message':
            return <Message />
        default:
            return <></>
    }
 }

 return (
    <div className={cl.noitems__wrapper}>
    <motion.h2 
    initial={{opacity: 0, y: -40}}
    animate={{opacity: 1, y: 0}}
    transition={{delay: 0.4, opacity: {duration: 0.3}, y: {duration: 0.3, delay: 0.4}}}
    className={cl.noitems__title}>
        {message}
    </motion.h2>
    <motion.div 
    initial={{opacity: 0, x: -100}}
    animate={{opacity: 1, x: 0}}
    transition={{duration: 0.3}}
    style={size ? {maxWidth: size} : null}
    className={cl.ibg__noitems}>
    {
        getContent()
    }
    </motion.div>
   </div>
 )
}

export default NoItems;