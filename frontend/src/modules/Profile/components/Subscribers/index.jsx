import { useState, useEffect } from "react";
import { useFetching } from '../../../../hooks/useFetching';
import { usePagination } from '../../../../hooks/usePagination';
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useScroll } from '../../../../hooks/useScroll';
import SubscribeService from '../../../../services/SubscribeService';
import Pagination from '../../../../components/Pagination';
import SubscribeItem from '../../../../components/SubscribeItem';
import UserLoader from '../../../../shared/Loaders/UserLoader';
import FetchDataLoader from '../../../../components/FetchDataLoader';
import NoItems from "../../../../shared/UI/NoItems";
import ScrollButton from '../../../../shared/UI/ScrollButton';
import cl from './Subscribers.module.scss';

const Subcribers = () => {

const { id } = useParams();
const user = useSelector(state => state.user.user);
const [subscribers, setSubscribers] = useState({data: [], count: null});
const [paginationSettings, setPaginationSettings] = useState({limit: 20, offset: 0});
const [scrollButtonIsVisible, setScrollButtonisVisible] = useScroll(1500);
const [isLoading, error, fetchSubscribes] = useFetching(async () => {
   const {rows, count} = await SubscribeService.getSubscribers(id);
   setSubscribers({data: rows, count});
});

const pages = usePagination(subscribers.count, paginationSettings.limit, paginationSettings.offset);

const handlePage = (offset) => setPaginationSettings({...paginationSettings, offset});

useEffect(() => {
 fetchSubscribes();
 // eslint-disable-next-line
}, [paginationSettings]);

  return (
    <div className={cl.subscribers__wrapper}>
     <FetchDataLoader 
    data={subscribers.data}
    loading={isLoading}
    error={error}
    noItems={<NoItems size={150} type="user" message={user.id === +id ? "У вас нет подписчиков" : "У пользователя нет подписчиков"} />}
    dataItem={(subscribe) => <SubscribeItem 
    key={subscribe.id} 
    subscribe={subscribe}
    />}
    loader={[...new Array(paginationSettings.limit)].map((_, i) => <UserLoader key={i} />)}
    /> 
    {
        pages.length > 1 && <Pagination pages={pages} currentPage={paginationSettings.offset} handlePage={handlePage} />
    }
    <ScrollButton isVisible={scrollButtonIsVisible} changevisible={setScrollButtonisVisible} />
    </div>
  )
}

export default Subcribers