import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../../../shared/UI/Button";
import { ReactComponent as Feed } from '../../../../assets/images/feed.svg';
import { motion } from 'framer-motion';
import cl from './NoAuthorize.module.scss';

const NoAuthorize = () => {
  
  const redirect = useNavigate();

  const location = useLocation();

  return (
    <div className={cl.noAuth__wrapper}>
    <motion.div 
    initial={{opacity: 0, y: -40}}
    animate={{opacity: 1, y: 0}}
    transition={{delay: 0.4, opacity: {duration: 0.3}, y: {duration: 0.3, delay: 0.4}}}
    className={cl.ibg__feed}>
    <Feed />
    </motion.div>
    <motion.p
    initial={{opacity: 0, x: -100}}
    animate={{opacity: 1, x: 0}}
    transition={{duration: 0.3}}
    >Лента доступна только авторизованным пользователям.
    Зарегистрируйтесь или войдите в свой аккаунт, чтобы получить доступ к этой странице.
    </motion.p>
    <Button onClick={() => redirect('/account/login', {state: {from: location.pathname}})} style={{padding: "5px 40px"}}>Войти</Button>
    </div>
  )
}

export default NoAuthorize;