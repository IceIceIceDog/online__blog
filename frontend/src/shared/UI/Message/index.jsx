import { useEffect } from 'react';
import { motion } from 'framer-motion';
import cl from './Message.module.scss';


const Message = ({isVisible, handleIsVisible, message, delay}) => {

  useEffect(() => {
    if (isVisible) setTimeout(() => handleIsVisible(false), delay);
    //eslint-disable-next-line
  }, [isVisible]);

  return (
    <motion.div
    key="message"
    initial={{y: 15, opacity: 0}} 
    animate={{y: 0, opacity: 1}}
    exit={{ y: -15,opacity: 0}}
    transition={{duration: 1}}
    className={cl.message}>
      <span>{message}</span>
      </motion.div>
  )
}

export default Message;