import { useParams } from 'react-router-dom';
import EditPost from '../modules/EditPost';

const PostEdit = () => {
  
  const { id }  = useParams();

 

  return (
   <EditPost postId={id} />
  )
}

export default PostEdit