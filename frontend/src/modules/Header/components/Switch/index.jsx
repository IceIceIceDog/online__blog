import { useState, useEffect } from 'react';
import cl from './Switch.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import {ThemeActions} from '../../../../services/ThemeActions';

const Switch = () => {
 const [checked, setChecked] = useState(false);

 const theme = useSelector(state => state.theme.theme);
 const dispatch = useDispatch();

 useEffect(() => {
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme){
    if (currentTheme === 'dark' && !checked) setChecked(true);
  }
  //eslint-disable-next-line
 }, []);


 const changeThemeHandler = () => {
    setChecked(!checked);
    dispatch(ThemeActions.changeTheme(theme));
    
 } 

  return (
    <>
    <div onClick = {changeThemeHandler} className= {cl.switch}>
    <input type='checkbox' checked = {checked} onChange={() => null} className={cl.switch__input}/>
    <span className= {cl.switch__slider}></span>
    </div>
    </>
  )
}

export default Switch;