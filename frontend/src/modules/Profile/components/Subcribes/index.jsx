import { useState, useEffect } from "react";
import { useFetching } from '../../../../hooks/useFetching';
import { usePagination } from '../../../../hooks/usePagination';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useScroll } from '../../../../hooks/useScroll';
import SubscribeService from '../../../../services/SubscribeService';
import Pagination from '../../../../components/Pagination';
import SubscribeItem from '../../../../components/SubscribeItem';
import UserLoader from '../../../../shared/Loaders/UserLoader';
import NoItems from '../../../../shared/UI/NoItems';
import FetchDataLoader from '../../../../components/FetchDataLoader';
import ScrollButton from '../../../../shared/UI/ScrollButton';
import cl from './Subscribes.module.scss';

const Subcribes = () => {

const { id } = useParams();
const user = useSelector(state => state.user.user);
const [subscribes, setSubscribes] = useState({data: [], count: null});
const [scrollButtonisVisible, setScrollButtonisVisible] = useScroll(1500);
const [paginationSettings, setPaginationSettings] = useState({limit: 20, offset: 0});
const [isLoading, error, fetchSubscribes] = useFetching(async () => {
   const {rows, count} = await SubscribeService.getSubscribes(id);
   setSubscribes({data: rows, count});
});

const pages = usePagination(subscribes.count, paginationSettings.limit, paginationSettings.offset);

const handlePage = (offset) => setPaginationSettings({...paginationSettings, offset});

useEffect(() => {
 fetchSubscribes();
 // eslint-disable-next-line
}, [paginationSettings]);

  return (
    <div className={cl.subscribes__wrapper}>
    <FetchDataLoader 
    data={subscribes.data}
    loading={isLoading}
    error={error}
    noItems={<NoItems type="user" size={150} message={user.id === +id ? "Вы ни на кого не подписаны" : "Пользователь ни на кого не подписан"} />}
    dataItem={(subscribe) => <SubscribeItem 
    key={subscribe.id} 
    subscribe={subscribe}
    />}
    loader={[...new Array(paginationSettings.limit)].map((_, i) => <UserLoader key={i} />)}
    />
    {
        pages.length > 1 && <Pagination pages={pages} currentPage={paginationSettings.offset} handlePage={handlePage} />
    }
    <ScrollButton isVisible={scrollButtonisVisible} changevisible={setScrollButtonisVisible} />
    </div>
  )
}

export default Subcribes;

