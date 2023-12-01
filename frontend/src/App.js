import Router from "./router";
import { useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { useDispatch } from "react-redux";
import UserService from "./services/UserService";

function App() {

const [theme, changeTheme] = useTheme();

const dispatch = useDispatch();
 
 useEffect(() => {
  changeTheme();
 }, [theme, changeTheme]);

 useEffect(() => {
  if (localStorage.getItem('token')) dispatch(UserService.refresh());
  //eslint-disable-next-line
 }, []);

  return (
   <Router /> 
  );
}

export default App;
