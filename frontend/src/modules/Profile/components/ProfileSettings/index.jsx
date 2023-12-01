import { useState } from "react"
import Input from '../../../../shared/UI/Input';
import Button from "../../../../shared/UI/Button";
import { motion, AnimatePresence } from 'framer-motion';
import cl from './ProfileSettings.module.scss';

const ProfileSetting = ({initialState, updateUser}) => {

  const [profile, setProfile] = useState({username: initialState.username});

  const [password, setPassword] = useState({current: '', again: '', newPassword: ''});

  const [passwordEditing, setPasswordEditing] = useState(false);

  const changeUsername = (username) => setProfile({...profile, username});

  const changePassword = (pass) => setPassword({...password, current: pass});

  const changeAgainPassword = (pass) => setPassword({...password, again: pass});

  const changeNewPassword = (pass) => setPassword({...password, newPassword: pass});

  const updateHandler = (e) => {
    e.preventDefault();
    updateUser({...profile, passwordData: {...password}});
  }

  const startUpdatePassword = (e) => {
    e.preventDefault();
    setPasswordEditing(!passwordEditing);
  }

  const cancelUpdate = (e) => {
    e.preventDefault();
    setProfile({...initialState});
    setPassword({current: '', again: '', newPassword: ''});
    setPasswordEditing(false);
  }
    
  return (
    <motion.div 
    initial={{opacity: 0, y: -15}}
    animate={{opacity: 1, y: 0}}
    exit={{opacity: 0, y: -15}}
    transition={{duration: 0.5}}
    className={cl.profile__settings__wrapper}>
    <h1 className={cl.profile__settings__title}>Настройки пользователя</h1>
    <form className={cl.profile__edit} name="profile__edit">
    <Input value={profile.username} changeHandler={changeUsername} />
    <Button onClick={startUpdatePassword} style={{padding: '5px 10px'}}>{passwordEditing ? 'Отмена' : 'Сменить пароль'}</Button>
    <AnimatePresence mode="wait">
    {
        passwordEditing && <motion.div
        style={{display: 'flex', flexDirection: 'column', gap: '20px'}}
        initial={{opacity: 0, height: 0}}
        animate={{opacity: 1, height: 'auto'}}
        exit={{opacity: 0, height: 0, transition: {duration: 1, height: {duration: 1, delay: 0.3}, opacity: {duration: 0.3}}}}
        transition={{opacity: {duration: 1, delay: 0.3}, height: {duration: 0.3}}}
        >
        <Input isPassword value={password.current} changeHandler={changePassword} placeholder="Старый пароль" />
        <Input isPassword value={password.again} changeHandler={changeAgainPassword} placeholder="Новый пароль" />
        <Input isPassword value={password.newPassword} changeHandler={changeNewPassword}placeholder="Повторите новый пароль" />
        </motion.div>
    }
    </AnimatePresence>
    <div className={cl.profile__edit__buttons}>
    <Button onClick={updateHandler} style={{padding: '5px 10px'}}>Обновить</Button>
    <Button onClick={cancelUpdate} styles="inverse" style={{padding: '5px 10px'}}>Отмена</Button>
    </div>
    </form>
    </motion.div>
  )
}

export default ProfileSetting;