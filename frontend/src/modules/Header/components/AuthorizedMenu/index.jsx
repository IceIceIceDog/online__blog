import { useEffect, useRef, useState } from 'react';
import useResize from '../../../../hooks/useResize';
import cl from './AuthorizedMenu.module.scss';
import { FaRegBell, FaChevronDown, FaUser, FaRegCircleXmark, FaPencil } from 'react-icons/fa6';
import UserService from '../../../../services/UserService';
import MessageService from '../../../../services/MessageService';
import { useDispatch, useSelector } from 'react-redux';
import { setAction } from '../../../../store/messageReducer';
import Switch from '../Switch';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AuthorizedMenu = ({user}) => {
 const [isOpen, setIsOpen] = useState(false);
 const messages = useSelector(state => state.messages.messages);
 const menuRef = useRef();
 const currentWidth = useResize();
 const dropdownClasslist = isOpen ? [cl.user__dropdown, cl.active] : [cl.user__dropdown];
 const dispatch = useDispatch();
 const location = useLocation();
 const navigate = useNavigate();

 const logout = (e) => {
   dispatch(UserService.logout());
   if (['profile'].includes(location.pathname)) navigate('/');
 }

 const handleMenuAreaClick = (e) => {
  if(!e.target.parentNode?.href){
     setIsOpen(!isOpen);
  }
 }

 useEffect(() => {
    const handlePageClick = (e) => {
    if (e.target && !menuRef.current.contains(e.target)) setIsOpen(false);
    }
   document.addEventListener('click', handlePageClick);
   return () => {
    document.removeEventListener('click', handlePageClick);
   }
   // eslint-disable-next-line
 }, []);

 useEffect(() => {
  dispatch(MessageService.getCount(user.id));
  const eventSource = new EventSource('http://localhost:7000/api/messages/new');
  eventSource.onmessage = event => {
    try{
      const message = JSON.parse(event.data);
      if (Array.isArray(message)){
        const index = message.findIndex(item => item.userId === user.id);
        if (index >= 0) dispatch(setAction(message[index].count)); 
      }
      else{
        if (+message.userId === user.id) dispatch(setAction(message.count));
      }
    }
   catch(e){
    console.log(e);
   }
  }
   return () => eventSource.close();
   // eslint-disable-next-line
 }, []);

 

  
  

 
  return (
    <div ref={menuRef} onClick = {handleMenuAreaClick} className={cl.user__menu}>
    {currentWidth > 500 && <Link to={`/profile/${user.id}/messages`}><FaRegBell />
    {messages > 0 && <span className={cl.msg__count}>{messages}</span>}
    </Link>}
   <div className={cl.user__info}>
    <div className={cl.user__image}>
        <img src={`http://localhost:7000/${user.avatar_img}`} alt='avatar'/>
    </div>
    <span className={isOpen 
        ? [cl.username, cl.active].join(' ') 
        : cl.username}><span className={cl.name}>{user.email}</span><FaChevronDown /></span>
   </div>
    <div onClick ={e => e.stopPropagation()} className={dropdownClasslist.join(' ')}>
        <ul className={cl.user__dropdown__list}>
        <button className={cl.button__exit} onClick={() => setIsOpen(false)}><FaRegCircleXmark /></button>
            <li className={cl.dropdown__list__item}>
            <Link to={`/profile/${user.id}`}>Профиль <FaUser /></Link>
            </li>
            <li className={cl.dropdown__list__item}>
            <Link to="/posts/create"> Написать пост <FaPencil /></Link>
            </li>
            {currentWidth <= 500 && <li className={cl.dropdown__list__item}>
            <Link to={`/profile/${user.id}/messages`}>Уведомления <FaRegBell /> 
            {messages > 0 && <span className={cl.msg__count}>{messages}</span>}</Link>
              </li>}
              <li className={cl.dropdown__list__item}>Сменить тему <Switch /></li>
            <li className={cl.dropdown__list__item}>
            <button onClick={logout} className={cl.dropdown__list__button}>Выйти</button>
            </li>
        </ul>
    </div>
    </div>
  )
}

export default AuthorizedMenu