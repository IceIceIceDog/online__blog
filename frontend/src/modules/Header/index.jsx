import cl from './Header.module.scss';
import LogoLight from '../../assets/images/logo-light.png';
import LogoDark from '../../assets/images/logo-dark.png'
import {FaSistrix} from 'react-icons/fa6';
import AuthorizedMenu from './components/AuthorizedMenu';
import AvatarLoader from '../../shared/Loaders/MainPageAvatarLoader';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { memo } from 'react';




const Header = () => {

const user = useSelector(state => state.user);

const navigate = useNavigate();

  return (
    <header>
     <div className={cl.header__container}>
     <div className={cl.header__body}>
     <div className={cl.header__logo}>
      <NavLink to='/'><img src ={localStorage.getItem('theme') 
      ? localStorage.getItem('theme') === 'dark' 
      ? LogoDark : LogoLight : LogoLight} alt="projectBlog"/></NavLink>
     </div>
     <nav className={cl.header__nav}>
     <ul className={cl.nav__list}>
     <li className={cl.link__item}><NavLink className={({ isActive }) => (isActive ? cl.active : '')} to='/'>Все посты</NavLink></li>
     <li className={cl.link__item}><NavLink className={({ isActive }) => (isActive ? cl.active : '')} to='/feed'>Моя лента</NavLink></li>
     <li className={cl.link__item}><NavLink className={({ isActive }) => (isActive ? cl.active : '')} to='/search'><FaSistrix className={cl.icon__link}/></NavLink></li>
     </ul>
     </nav>
     {
      user.loading ? <AvatarLoader />
      : user.isAuth ? <AuthorizedMenu user={user.user}/> : <button onClick={() => navigate('/account/login')} className={cl.auth}>Войти</button>
     }
     </div>
     </div>
    </header>
  )
}

export default memo(Header);