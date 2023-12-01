import {motion } from 'framer-motion';
import cl from './Modal.module.scss';

const Modal = ({isOpen, openHandler, children}) => {
  
  const closeModal = () => openHandler(false);
  
  const overlayClassList = isOpen ? [cl.modal__wrapper, cl.open] : [cl.modal__wrapper];

  const modalBodyClassList = isOpen ? [cl.modal__body, cl.open] : [cl.modal__body];

  return (
    <motion.div 
    initial={{scale: 0, opacity: 0}}
    animate={{scale: 1, opacity: 1}}
    exit={{scale: 0, opacity: 0}}
    transition={{duration: 0.1, delayChildren: 0.2}}
    onClick={closeModal} className={overlayClassList.join(' ')}>
        <motion.div 
        initial={{opacity: 0, y: -100}}
        animate={{opacity: 1, y: 0}}
        exit={{opacity: 1, y: 0}}
        transition={{duration: 0.3}}
        onClick={e => e.stopPropagation()} className={modalBodyClassList.join(' ')}>
            {children}
        </motion.div>
    </motion.div>
  )
}

export default Modal;