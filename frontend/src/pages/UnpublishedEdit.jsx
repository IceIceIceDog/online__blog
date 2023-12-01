import { useParams } from 'react-router-dom';
import EditPost from '../modules/EditPost';

const UnpublishedEdit = () => {
  
  const { id }  = useParams();

  console.log(id);

  return (
   <EditPost postId={id} type='moderated' />
  )
}

export default UnpublishedEdit;