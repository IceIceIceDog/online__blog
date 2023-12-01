import { useParams } from "react-router-dom";
import Profile from "../modules/Profile";



const ProfilePage = () => {
  
  const { id } = useParams();

  return (
    <Profile userId={id} />
  )
}

export default ProfilePage;