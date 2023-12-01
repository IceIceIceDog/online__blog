import cl from './Message.module.scss';

const MessageLoader = () => {
  return (
    <div className={cl.message__loader}>
    <div className={cl.ibg__message}></div>
    <div className={cl.message__body}></div>
    </div>
  )
}

export default MessageLoader;