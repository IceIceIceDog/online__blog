import cl from './TopWeek.module.scss';
import TopUsers from './components/TopUsers';
import TopArticles from './components/TopArticles';

const TopWeek = () => {
  return (
    <div className={cl.top}>
    <h1 className={cl.topweek__title}>Топ недели</h1>
    <div className={cl.topweek__container}>
    <TopUsers />
    <TopArticles />
    </div>
    </div>
   
  )
}

export default TopWeek;