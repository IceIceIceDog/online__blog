import {useEffect, useState} from 'react';
import { useFetching } from '../../../../hooks/useFetching';
import { useParams } from 'react-router-dom';
import { getDateFormat } from '../../../../shared/Helpers/getDateFormat';
import UserService from '../../../../services/UserService';
import ProfileMainLoader from '../../../../shared/Loaders/ProfileMainLoader';
import ErrorHandler from '../../../../shared/UI/ErrorHandler';
import cl from './Index.module.scss';



const Index = () => {
  const { id } = useParams();
  const [mainData, setMainData] = useState({
    username: '',
    email: '',
    createdAt: ''
  });

  const [isLoading, error, fetchMainData] = useFetching(async () => {
    const { email, username, createdAt } = await UserService.getMain(id);
    setMainData({...mainData, email, username, createdAt});
  });

  useEffect(() => {
    fetchMainData();
    // eslint-disable-next-line
  }, []);

  

  return (
    <div className={cl.main__wrapper}>
     {
       isLoading ? <ProfileMainLoader />
       : (error.error || error.errors.length) ? <ErrorHandler />
       : <>
       <div className={cl.main__data__item}>
       <span className={cl.data__title}>Email:</span>
       <span>{mainData.email}</span>
       </div>
       <div className={cl.main__data__item}>
       <span className={cl.data__title}>Никнейм:</span>
       <span>{mainData.username}</span>
       </div>
       <div className={cl.main__data__item}>
       <span className={cl.data__title}>Зарегистрирован:</span>
       <span>{getDateFormat(new Date(mainData.createdAt))}</span>
       </div>
       </>
     }
    </div>
  )
}

export default Index;