import cl from './PageLoader.module.scss';
import { ReactComponent as Loader } from './pageLoader.svg';

const PageLoader = () => {
  return (
    <div className={cl.page__loader}>
    <Loader />
    </div>
  )
}

export default PageLoader