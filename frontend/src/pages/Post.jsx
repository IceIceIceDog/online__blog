import PostFocused from '../modules/PostFocused';
import TopWeek from '../modules/TopWeek';
import { useParams } from 'react-router-dom';

const Post = () => {

const {id} = useParams();

  return (
    <>
    <PostFocused postId={id}/>
    <TopWeek />
    </>
  )
}

export default Post