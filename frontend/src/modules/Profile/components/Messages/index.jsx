import { useState, useEffect, useRef } from 'react';
import { useFetching } from '../../../../hooks/useFetching';
import { useCheckAuth } from '../../../../hooks/useCheckAuth';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useScroll } from '../../../../hooks/useScroll';
import { setAction } from '../../../../store/messageReducer';
import MessageService from '../../../../services/MessageService';
import MessageLoader from '../../../../shared/Loaders/MessageLoader';
import Button from '../../../../shared/UI/Button';
import MessageItem from '../../../../components/MessageItem';
import FetchDataLoader from '../../../../components/FetchDataLoader';
import NoItems from '../../../../shared/UI/NoItems';
import ScrollButton from '../../../../shared/UI/ScrollButton';
import { FaCircleCheck, FaBars } from 'react-icons/fa6';
import { AnimatePresence } from 'framer-motion';
import cl from './Messages.module.scss';

const Messages = () => {
const { id } = useParams();
const redirect = useNavigate();
const menuRef = useRef();
const [menuOpen, setMenuOpen] = useState(false);
const [scrollButtonIsVisible, setScrollButtonisVisible] = useScroll(1500);
const dispatch = useDispatch();
const [messages, setMessages] = useState([]);
const [selectedMessages, setSelectedMessages] = useState([]);
const [isLoading, error, fetchMessages] = useFetching(async () => {
      const userMessages = await MessageService.getMessages(id);
      setMessages(userMessages.data);
});

useCheckAuth(() => redirect(`/profile/${id}`));



const deleteMessages = async () => {
   const deletedMessages = await MessageService.deleteMessages(selectedMessages);
   if (deletedMessages.data > 0){
   const messagesCount = messages.length - deletedMessages.data;
   setMessages(prev => prev.filter(item => !selectedMessages.includes(item.id)));
   setSelectedMessages([]);
   dispatch(setAction(messagesCount));
   }
   
}

const handleMessageSelected = (id) => setSelectedMessages([...selectedMessages, id]);

const handleMessageUnselected = (id) => setSelectedMessages(selectedMessages.filter(message => message !== id));

const selectAll = () => {
  setMenuOpen(false);
  setSelectedMessages(messages.map(item => item = item.id));

}

const unSelectAll = () => {
  setMenuOpen(false);
  setSelectedMessages([]);
}

useEffect(() => {
 const handleClickOutsideMenu = (e) => {
  if (e.target && !menuRef.current?.contains(e.target)) setMenuOpen(false);
 }
 document.addEventListener('click', handleClickOutsideMenu);
 return () => document.removeEventListener('click', handleClickOutsideMenu);
}, []);

useEffect(() => {
 fetchMessages();
 // eslint-disable-next-line
}, []);

  return (
    <div className={cl.messages__wrapper}>
      <div className={cl.messages__header}>
      <Button
      style={{padding: "5px 20px"}} 
      onClick={deleteMessages} 
      disabled={selectedMessages.length > 0 ? false : true}>Прочитано <FaCircleCheck /></Button>
      <div ref={menuRef} className={cl.messages__header__menu}>
      <button onClick={() => setMenuOpen(!menuOpen)} className={cl.icon__button}><FaBars /></button>
      <div className={menuOpen ? [cl.header__menu__dropdown, cl.open].join(' ') : cl.header__menu__dropdown}>
        <ul className={cl.dropdown__list}>
          <li onClick={selectAll} className={cl.dropdown__list__item}>Пометить всё как прочитанное</li>
          <li onClick={unSelectAll} className={cl.dropdown__list__item}>Пометить всё как непрочитанное</li>
        </ul>
      </div>
      </div>
      </div>
      <div className={cl.messages__main}>
      <AnimatePresence mode='wait'>
       <FetchDataLoader 
       data={messages}
       loading={isLoading}
       error={error}
       noItems={<NoItems type="message" message="У вас нет уведомлений" size={150} />}
       loader={[...new Array(5)].map((_, i) => <MessageLoader key={i} />)}
       dataItem={(message) => <MessageItem 
        key={message.id} 
        message={message} 
        selectMessage={handleMessageSelected}
        unselectMessage={handleMessageUnselected}
        selected={selectedMessages.includes(message.id)}
        />}
       />
       </AnimatePresence>
      </div>
      <ScrollButton isVisible={scrollButtonIsVisible} changevisible={setScrollButtonisVisible} />
    </div>
  )
}

export default Messages;

