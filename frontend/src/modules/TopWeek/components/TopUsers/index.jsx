import {useState, useEffect} from 'react';
import { useFetching } from '../../../../hooks/useFetching';
import UserService from '../../../../services/UserService';
import { Link } from 'react-router-dom';
import UserLoader from '../../../../shared/Loaders/UserLoader';
import FetchDataLoader from '../../../../components/FetchDataLoader';
import { FaRegStar } from 'react-icons/fa6';
import cl from './TopUsers.module.scss';


const TopUsers = () => {
  
  const [users, setUsers] = useState([]);

  const [isLoading, error, fetchTopUsers] = useFetching(async () => {
    const topUsers = await UserService.getTop();
    setUsers(topUsers.data);
  }) 

  useEffect(() => {
    fetchTopUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={cl.users__container}>
      <h4 className={cl.topUsers__title}>Авторы</h4>
      <div className={cl.topUsers}>
     <FetchDataLoader 
      data={users}
      loading={isLoading}
      error={error}
      loader={[...new Array(5)].map((_, i) => <UserLoader key={i} />)}
      noItems={<h3>Здесь еще ничего нет</h3>}
      dataItem={(user) =>  <div key ={user.id} className={cl.topUsers__user}>
      <div className={cl.user__container}>
        <Link to={`/profile/${user.id}`}>
        <div className={cl.ibg__user}>
          <img src={`http://localhost:7000/${user.avatar_img}`} alt={user.username}/>
        </div>
        </Link>
        <span className={cl.username}><Link to={`/profile/${user.id}`}>{user.username}</Link></span>
      </div>
      <div className={cl.user__rate}>
          <span className={cl.icon__button}>+ {user.rate} <FaRegStar /></span>
        </div>
    </div>}
     />
    </div>
    </div>
  )
}

export default TopUsers;

