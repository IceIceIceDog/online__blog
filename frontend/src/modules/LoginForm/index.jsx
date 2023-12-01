import cl from './LoginForm.module.scss';
import Input from '../../shared/UI/Input';
import Button from '../../shared/UI/Button';
import { useState, useEffect } from 'react';
import { useCheckAuth } from '../../hooks/useCheckAuth';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import UserService from '../../services/UserService';
import { errorHandlerAction } from '../../store/userReducer';
import { motion, AnimatePresence } from 'framer-motion';


const LoginForm = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [againPassword, setAgainPassword] = useState('');
 const [errorsVisible, setErrorsVisible] = useState(false);
 const dispatch = useDispatch();
 const redirect = useNavigate();
 const location = useLocation();
 
 const page = location.state?.from ? location.state.from : '/';

 const fetchErrors = useSelector(state => state.user.error);
 useCheckAuth(() => redirect(page), true);
 
  const login = (e) => {
    e.preventDefault();
      dispatch(errorHandlerAction('', []));
      if (password === againPassword){
        dispatch(UserService.login(email, password));
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

  const registrationLink = (e) => {
    e.preventDefault();
    redirect('/account/registration');
  }

  useEffect(() => {
    document.title = "Авторизация";
  }, []);
 
 return (
    <div className={cl.form__wrapper}>
    <form className={cl.login__form}>
    <h3 className={cl.login__form__title}>Авторизация</h3>
    <Input placeholder="Ваш email..." value={email} changeHandler={setEmail} required />
    <Input placeholder="Ваш пароль..." value={password} changeHandler={setPassword} required />
    <Input placeholder="Повторите пароль..." value={againPassword} changeHandler={setAgainPassword} required />
    <Button style={{padding: "5px 0"}} onClick={login}>Войти</Button>
    <Button style={{padding: "5px 0"}} styles="inverse" onClick={registrationLink}>Зарегистрироваться</Button>
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

export default LoginForm