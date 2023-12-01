
import Input from '../../../../shared/UI/Input';
import { FaXmark, FaSistrix } from 'react-icons/fa6';
import cl from './SearchInput.module.scss';
import { motion } from 'framer-motion';

const SearchInput = ({searching, changeSearching, changeSearch, searchValue}) => {
   
  const clearSearch = () =>{
    changeSearch('');
    changeSearching(false);
  }

  const onSearch = (value) => {
    if (!searching) changeSearching(true);
    changeSearch(value);
    if (value === "") changeSearching(false);
  }

  return (
    <motion.div 
    initial={{opacity: 0, y: -15}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.3}}
    className={cl.search__input__wrapper}>
    <Input placeholder="Что ищем?" value={searchValue} changeHandler={onSearch} />
    {
        searching
        ? <button onClick={clearSearch} className={[cl.icon__button, cl.exit].join(' ')}><FaXmark /></button>
        : <button className={cl.icon__button}><FaSistrix /></button>
    }
    </motion.div>
  )
}

export default SearchInput

