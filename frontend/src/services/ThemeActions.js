import {changeAction} from '../store/themeReducer';

export class ThemeActions{
    static changeTheme(currentTheme){
       return dispatch => {
          const theme = currentTheme === 'light' ? 'dark' : 'light';
          localStorage.setItem('theme', theme);
          dispatch(changeAction(theme));
       }
    }
}