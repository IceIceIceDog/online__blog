
import { Link } from 'react-router-dom';
import cl from './MessageItem.module.scss';
import { getDateFormat } from '../../shared/Helpers/getDateFormat';
import { ReactComponent as MessageImg } from '../../assets/images/default-message.svg';
import { motion } from 'framer-motion';

const MessageItem = ({message, selectMessage, unselectMessage, selected}) => {



const handleSelect = () => {
    selected ? unselectMessage(message.id) : selectMessage(message.id);
}

const getMessageImage = () => {
    switch (message.type){
        case 'post':
            return `http://localhost:7000/${message.postImage}`;
        case 'comment':
            return `http://localhost:7000/${message.userImage}`;
        case 'subscribe':
            return `http://localhost:7000/${message.userImage}`;
        default:
            return null;
    }
}


  return (
    <motion.div 
    key={message.id}
    initial={{opacity: 0, y: -15}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.3}}
    exit={{opacity: 0, y: -15}}
    onClick={handleSelect} 
    className={selected ? [cl.message__body, cl.selected].join(' ') : cl.message__body}>
    <div className={cl.ibg__message} style={message.type === "comment" ? {borderRadius: "50%"} : null}>
     {
        message.defaultImage ? 
        <MessageImg />
        : <img src={getMessageImage()} alt="Уведомление"/>
     }
    </div>
    <div className={cl.message__content}>
    {
        message.type === "message" ?
        <p>{message.content}</p>
        : <>
        <div className={cl.content}>
          <p>{message.content}</p>
          <Link onClick={e => e.stopPropagation()} to={message.href}>{message.hrefContent}</Link>
          </div>
          </>
    }
     <span className={cl.message__date}>{getDateFormat(new Date(message.createdAt))}</span>
    </div>
    </motion.div>
  )
}

export default MessageItem
