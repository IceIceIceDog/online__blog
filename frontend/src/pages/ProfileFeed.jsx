import { useSelector } from 'react-redux';
import Feed from '../modules/Feed';
import NoAuthorize from '../modules/Feed/components/NoAuthorize';
import TopWeek from '../modules/TopWeek';

const ProfileFeed = () => {
  
  const user = useSelector(state => state.user.user);

  return (
    <>
    {user.id ? <Feed userId={user.id}/> : <NoAuthorize />}
    {user.id && <TopWeek />}
   </>
  )
}

export default ProfileFeed;

