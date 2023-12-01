import cl from './Pagination.module.scss';
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa6';

const Pagination = ({pages, handlePage, currentPage}) => {
  
  const pageHandler = (page) => {
     if (isFinite(page)){
      window.scrollTo(0, 0);
      handlePage(page);
     } 
     return;
  } 

  const pagePrev = () => {
    if (currentPage ===  pages[0] - 1) return;
    handlePage(currentPage - 1);
  }

  const pageNext = () => {
    if (currentPage === pages[pages.length - 1] - 1) return;
    handlePage(currentPage + 1);
  }
  
  return (
    <div className={cl.page__container}>
     <ul className={cl.page__list}>
     <li onClick={pagePrev} className={[cl.page__button, cl.page__item].join(' ')}><FaChevronLeft /></li>
     {
      pages.map((page, i) => <li key={`${page}${i}`} onClick={() => pageHandler(page - 1)} 
      className={(page - 1) === currentPage ? [cl.page__item, cl.active].join(' ') : cl.page__item}>{page}</li>)
     }
     <li onClick={pageNext} className={[cl.page__button, cl.page__item].join(' ')}><FaChevronRight /></li>
     </ul>
    </div>
  )
}

export default Pagination