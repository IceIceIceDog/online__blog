import cl from './AvatarLoader.module.scss';
import { ReactComponent as Loader } from './avatar-loader.svg';

const AvatarLoader = () => {
  return (
    <div className={cl.avatar__loader}>
    <Loader />
    </div>
  )
}

export default AvatarLoader