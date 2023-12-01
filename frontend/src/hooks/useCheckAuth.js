import { useEffect} from "react";
import { useSelector } from "react-redux";


export const useCheckAuth = (callback, checkedValue = false) => {
    const isAuth = useSelector(state => state.user.isAuth);
    
    useEffect(() => {
     if (isAuth === checkedValue) {
        try{
            callback();
        }
        catch(e){
            console.log(e);
        }
     }
     //eslint-disable-next-line
    }, [isAuth]);
}