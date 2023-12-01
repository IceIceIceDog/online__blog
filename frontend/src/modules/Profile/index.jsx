import { useState, useEffect } from "react";
import { useFetching } from '../../hooks/useFetching';
import { useCheckAuth } from '../../hooks/useCheckAuth';
import {NavLink, Outlet} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux';
import UserService from '../../services/UserService';
import SubcribesService from '../../services/SubscribeService';
import { changeAction } from "../../store/userReducer";
import Button from '../../shared/UI/Button';
import Modal from '../../shared/UI/Modal';
import AvatarChange from './components/AvatarChange';
import Settings from './components/Settings';
import ProfileLoader from '../../shared/Loaders/ProfileLoader';
import Message from "../../shared/UI/Message";
import NotFound from '../../shared/UI/NotFound';
import { motion, AnimatePresence } from 'framer-motion';
import {FiCheckCircle } from 'react-icons/fi';
import cl from './Profile.module.scss';



const Profile = ({userId}) => {

const user = useSelector(state => state.user.user);    

const dispatch = useDispatch();

const [isLoading, error, fetchData] = useFetching(async () => {
    const profile = await UserService.getProfile(userId);
    const {id, username, email, avatar_img, decency, rate, createdAt, email_confirmed, subscribers } = profile;
    setProfileData({...profileData, id, username, email, avatar_img, decency, rate, createdAt, email_confirmed, subscribers});
});    

const [modalIsOpen, setIsOpen] = useState(false);

const [editing, setEditing] = useState(false);

const [messageVisible, setMessageVisible] = useState(false);

const [msg, setMsg] = useState('');

useCheckAuth(() => setEditing(false));


const [profileData, setProfileData] = useState({
    id: '',
    username: '',
    email: '',
    avatar_img: '',
    decency: '',
    rate: '',
    createdAt: '',
    email_confirmed: null,
    subscribers: []
});

const subscribe = async () => {
    try{
        const subscribe = await SubcribesService.subscribe(profileData.id, user.id);
        setProfileData({...profileData, subscribers: [{id: subscribe.id}]});
    }
    catch(e){
        console.log(e);
    }
}


const unsubscribe = async () => {
    try{
        const deletedSubscribe = await SubcribesService.unsubscribe(profileData.subscribers[0].id);
        deletedSubscribe > 0 && setProfileData({...profileData, subscribers: []});
    }
    catch(e){
      console.log(e);
    }
}

useEffect(() => {
 fetchData();
 if (profileData.id) document.title = profileData.username;
 // eslint-disable-next-line
}, [userId]);


const updateUser = async (userData) => {
   try{
    if (userData.passwordData?.current){
        const {again, newPassword} = userData.passwordData;
        if (newPassword){
            if (newPassword === again){
                setIsOpen(false);
                const updatedUser = await UserService.update({...userData, id: profileData.id});
                const {id, username, email, avatar_img, decency, rate, createdAt, email_confirmed} = updatedUser;
                dispatch(changeAction({username, avatar_img}));
                setProfileData({...profileData, id, username, email, avatar_img, decency, rate, createdAt, email_confirmed});
                setMsg('Данные профиля успешно обновлены');
            }
            else setMsg('Пароли не совпадают');     
        }
        else setMsg('Введите новый пароль')
    }
    else{
        setIsOpen(false);
        const updatedUser = await UserService.update({...userData, id: profileData.id});
        const {id, username, email, avatar_img, decency, rate, createdAt, email_confirmed} = updatedUser;
        dispatch(changeAction({username, avatar_img}));
        setProfileData({...profileData, id, username, email, avatar_img, decency, rate, createdAt, email_confirmed});
        setMsg('Данные профиля успешно обновлены');
    }
   }
   catch(e){
    if (e.response?.status === 400){
        setMsg(e.response.data.message);
    }
    else setMsg('Произошла ошибка');
    console.log(e);
   }
   finally{
     setMessageVisible(true);
   }
}

const getDecencyStyle = decency => {
    if (decency <= 5000) return [cl.data, cl.bad].join(' ');
    if (decency > 5000 && decency <= 7500) return [cl.data, cl.normal].join(' ');
    if (decency > 7500) return [cl.data, cl.good].join(' ');
} 
   
  return (
    <div className={cl.profile__wrapper}> 
    {
        modalIsOpen && <Modal isOpen={modalIsOpen} openHandler={setIsOpen}>
         <AvatarChange updateHandler={updateUser} />
        </Modal>
    }
    {
        isLoading ?
        <ProfileLoader />
        :

        <>
    <div className={cl.profile__main}>
    {
        (error.error || error.errors.length || !profileData.id) ?
        <NotFound />
        : <div className={cl.user__info}>
            <div className={cl.user__avatar}>
            <div className={cl.ibg__user}>
            <img src={`http://localhost:7000/${profileData.avatar_img}`} alt={profileData.username} />
            </div>
            {
              user.id === profileData.id ? <Button onClick={() => setIsOpen(true)} style={{padding: '5px 10px'}}>Сменить фото</Button>
              : profileData.subscribers?.length && profileData.subscribers[0].id ? <Button onClick={unsubscribe} style={{padding: '5px 10px'}}>Отписаться</Button>
              : <Button onClick={subscribe} style={{padding: '5px 10px'}}>Подписаться</Button>
            }
            </div>
            <div className={cl.user__statistic}>
            <h1 className={cl.username__title}>{profileData.username} {profileData.email_confirmed && <FiCheckCircle />}</h1>
            <div className={cl.statictic__info}>
            <div className={cl.statictic__info__item}>
            <p>Рейтинг</p>
            <p className={cl.data}>{profileData.rate}</p>
            </div>
            <div className={cl.statictic__info__item}>
            <p>Порядочность</p>
            <p className={getDecencyStyle(profileData.decency)}>{profileData.decency}</p>
            </div>
            </div>
            </div>
            {
                profileData.id === user.id 
                && <div className={cl.settings}>
                    {
                        editing 
                        ? <Button style={{padding: '5px 40px'}} onClick={() => setEditing(false)}>Применить</Button>
                        : <Button onClick={() => setEditing(true)} style={{padding: '5px 10px'}}>Настройки профиля</Button>
                    }
                </div>
            }
        </div>
    }
    </div>
    {
        editing 
        ? <Settings updateUser={updateUser} initialState={profileData} />
        : <>
        <motion.div 
        initial={{opacity: 0, y: -15}}
        animate={{opacity: 1, y: 0}}
        exit={{opacity: 0, y: -15 }}
        transition={{duration: 0.5}}
        className={cl.profile__tabs}>
    <nav className={cl.profile__tabs__nav}>
        <ul className={cl.profile__navlist}>
            <li><NavLink to={`.`} className={({ isActive }) => (isActive ? cl.active : '')}>Профиль</NavLink></li>
            <li><NavLink to='posts' className={({ isActive }) => (isActive ? cl.active : '')}>Публикации</NavLink></li>
            <li><NavLink to='comments' className={({ isActive }) => (isActive ? cl.active : '')}>Комментарии</NavLink></li>
            <li><NavLink to='bookmarks' className={({ isActive }) => (isActive ? cl.active : '')}>Закладки</NavLink></li>
            {  user.id === profileData.id &&
                <li><NavLink to={`messages`} className={({ isActive }) => (isActive ? cl.active : '')}>Уведомления</NavLink></li>
            }
            <li><NavLink to='subscribers' className={({ isActive }) => (isActive ? cl.active : '')}>Подписчики</NavLink></li>
            <li><NavLink to='subscribes' className={({ isActive }) => (isActive ? cl.active : '')}>Подписки</NavLink></li>
        </ul>
    </nav>
    </motion.div>
    <motion.div 
    initial={{opacity: 0, y: -15}}
    animate={{opacity: 1, y: 0}}
    exit={{ opacity: 0,y: -15}}
       transition={{duration: 0.5}}
    className={cl.profile__tabs__page}>
    <Outlet />
    </motion.div>
        </>
    }
        </>
    }
    <AnimatePresence>
    {messageVisible && <Message isVisible={messageVisible} handleIsVisible={setMessageVisible} message={msg} delay={3000} />}
    </AnimatePresence>
    </div>
  )
}

export default Profile