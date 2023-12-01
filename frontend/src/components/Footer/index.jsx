import { Link } from 'react-router-dom';
import { memo } from 'react';
import cl from './Footer.module.scss';
import { FaVk, FaTwitter, FaTelegram, FaDiscord} from 'react-icons/fa6';

const Footer = () => {

  return (
    <footer>
     <div className={cl.footer__container}>
      <div className={cl.footer__body}>
        <div className={cl.footer__logo}><span>projBlog</span></div>
       <div className={cl.footer__content}>
       <ul className={[cl.footer__list, cl.footer__important].join(' ')}>
        <li className={cl.footer__list__item}><h4 className={cl.footer__list__title}>Важное</h4></li>
        <li className={cl.footer__list__item}><Link to="/info/rules">Политика конфиденциальности</Link></li>
        <li className={cl.footer__list__item}><Link to="/info/rules">Авторское право</Link></li>
        <li className={cl.footer__list__item}><Link to="/info/rules">Пользовательское соглашение</Link></li>
       </ul>
       <ul className={[cl.footer__list, cl.footer__contacts].join(' ')}>
        <li className={cl.footer__list__item}><h4 className={cl.footer__list__title}>Контакты</h4></li>
        <li className={cl.footer__list__item}>email:<p>uwowmonk@mail.ru</p></li>
        <li className={cl.footer__list__item}>телефон:<p>+7(967)801-11-63</p></li>
       </ul>
       <ul className={[cl.footer__list, cl.footer__info].join(' ')}>
        <li className={cl.footer__list__item}><h4 className={cl.footer__list__title}>Информация</h4></li>
        <li className={cl.footer__list__item}><Link to="/info/rules">Правила сайта</Link></li>
        <li className={cl.footer__list__item}><Link to="/info/about">О нас</Link></li>
        <li className={cl.footer__list__item}><Link to="/info/faq">Ответы на вопросы</Link></li>
       </ul>
      <div className={cl.footer__social}>
        <h4 className={cl.footer__list__title}>Наши соцсети</h4>
        <ul className={cl.social__list}>
        <li className={cl.list__item}><Link to="/social"><FaVk /></Link></li>
        <li className={cl.list__item}><Link to="/social"><FaDiscord /></Link></li>
        <li className={cl.list__item}><Link to="/social"><FaTelegram /></Link></li>
        <li className={cl.list__item}><Link to="/social"><FaTwitter /></Link></li>
        </ul>
      </div>
       </div>
       <p style={{marginTop: '100px', opacity: '0.5', fontWeight: '400'}}>projBlog.ru© 2023. Все права защищены.</p>
      </div>
     </div>
    </footer>
  )
}

export default memo(Footer);