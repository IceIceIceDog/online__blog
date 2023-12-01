import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import { ReactComponent as ForbiddenImg } from '../../../assets/images/forbidden.svg';
import { motion } from 'framer-motion';
import cl from './Forbidden.module.scss';

const Forbidden = ({message}) => {

  const redirect = useNavigate();

  return (
    <div className={cl.forbidden}>
    <motion.h2
    initial={{opacity: 0, y: -40}}
    animate={{opacity: 1, y: 0}}
    transition={{delay: 0.4, opacity: {duration: 0.3}, y: {duration: 0.3, delay: 0.4}}}
    className={cl.forbidden__title}
    >
    {message}
    </motion.h2>
    <motion.div
    initial={{opacity: 0, x: -100}}
    animate={{opacity: 1, x: 0}}
    transition={{duration: 0.3}}
    className={cl.ibg__forbidden}
    >
    <ForbiddenImg />
    </motion.div>
    <Button onClick={() => redirect('/')} style={{padding: "5px 10px"}}>На главную</Button>
    </div>
  )
}

export default Forbidden