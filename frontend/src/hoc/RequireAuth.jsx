import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RequireAuth = ({children}) => {
  
const location = useLocation();

const user = useSelector(state => state.user.user);

return (
    <>
    {
        user.id ? children : <Navigate to="/account/login" state={{from: location.pathname}} />
    }
    </>
)

}

export default RequireAuth;