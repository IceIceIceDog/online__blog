import cl from './Registration.module.scss';
import Input from '../../shared/UI/Input';
import Button from '../../shared/UI/Button';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCheckAuth } from '../../hooks/useCheckAuth';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import { errorHandlerAction } from '../../store/userReducer';
import { getAvatar } from '../../shared/Helpers/getAvatar';
import { motion, AnimatePresence } from 'framer-motion';




const RegistrationForm = () => {
 const [email, setEmail] = useState('');
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
 const [againPassword, setAgainPassword] = useState('');
 const [errorsVisible, setErrorsVisible] = useState(false);
 const dispatch = useDispatch();
 const redirect = useNavigate();
 const fetchErrors = useSelector(state => state.user.error);
 useCheckAuth(() => redirect(`/`), true);
 
  const loginLink = (e) => {
    e.preventDefault();
    redirect('/account/login');
  }

  const registration = (e) => {
    e.preventDefault();
    dispatch(errorHandlerAction('', []));
    if (password === againPassword){
      const avatar_img = getAvatar(username);
      dispatch(UserService.registration(email, username, password, avatar_img));
      if (fetchErrors.fetchingError || fetchErrors.message || fetchErrors.errors.length) {
        setErrorsVisible(true);
        setTimeout(() => setErrorsVisible(false), 3000);
      } 
    }
    else{
      dispatch(errorHandlerAction('Пароли должны совпадать', []));
      return;
    } 
  }

  useEffect(() => {
    document.title = "Авторизация";
  }, []);

 return (
    <div className={cl.form__wrapper}>
    <form className={cl.registration__form}>
    <h3 className={cl.registration__form__title}>Регистрация</h3>
    <Input placeholder="Ваш email..." value={email} changeHandler={setEmail} required />
    <Input placeholder="Никнейм..." value={username} changeHandler={setUsername} required />
    <Input placeholder="Ваш пароль..." value={password} changeHandler={setPassword} required />
    <Input placeholder="Повторите пароль..." value={againPassword} changeHandler={setAgainPassword} required />
    <Button style={{padding: "5px 0"}} onClick={registration}>Зарегистрироваться</Button>
    <Button style={{padding: "5px 0"}} styles="inverse" onClick={loginLink}>Войти</Button>
    </form>
    <AnimatePresence>
    {errorsVisible && <motion.div 
    initial={{y: 15, opacity: 0}} 
    animate={{y: 0, opacity: 1}}
    exit={{ y: -15,opacity: 0}}
    transition={{duration: 1}}
    className={cl.login__errors}>
    <ul className={cl.error__list}>
      {
    
        fetchErrors.errors.length ?
        fetchErrors.errors.map(error => <li className={cl.error__item}>{error.msg}*</li>)
        : <li className={cl.error__item}>{fetchErrors.message}*</li>
      }
      </ul>
      </motion.div>}
      </AnimatePresence>
    </div>
  )
}

export default RegistrationForm;