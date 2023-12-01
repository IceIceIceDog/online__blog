import { useEffect, useState, useMemo, useRef } from 'react';
import { useFetching } from '../../hooks/useFetching';
import cl from './PostFilter.module.scss';
import Select from 'react-select';
import CategoryService from '../../services/CategoryService';
import SubjectService from '../../services/SubjectService';
import '../../assets/style/_select.scss';
import useResize from '../../hooks/useResize';
import FilterLoader from '../../shared/Loaders/FilterLoader';
import ErrorHandler from '../../shared/UI/ErrorHandler';
import { FaArrowDownWideShort , FaArrowRotateLeft } from 'react-icons/fa6';


const PostFilter = ({filter, setFilter}) => {

  const filterRef = useRef();
  
  const currentWidth = useResize();

  const [filterIsOpen, setFilterIsOpen] = useState(false);
  
  const [subjects, setSubjects] = useState([]);

  const [categories, setCategories] = useState([]);

  const [isLoading, error, fetchSelectValues] = useFetching(async () => {
     const categoriesData = await CategoryService.getAll();
     const subjectsData = await SubjectService.getAll();
     setCategories(categoriesData.data);
     setSubjects(subjectsData);
  });

  const staticOptions = useMemo(() => ({
    rate: [
        {label: 'По рейтингу', value: ''},
        {label: 'Больше 25', value: 'more25'},
        {label: 'Больше 50', value: 'more50'},
        {label: 'Больше 75', value: 'more75'},
        {label: 'Максимальный', value: 'max'}
    ],
    date: [
        {label: 'По дате', value: ''},
        {label: 'Сначала новые', value: 'DESC'},
        {label: 'Сначала старые', value: 'ASC'}
    ],
     popular: [
        {label: 'Все', value: ''},
        {label: 'Популярные', value: 'DESC'}
     ],
     limit: [
      {label: 'Показывать', value: 10},
      {label: 'По 20', value: 20},
      {label: 'По 50', value: 50}
    ]
 }), []);

const getSelectedValue = (options, value) => {
    return options.find(option => option.value === value);
  }

const getSelectedMultiValues = (options, value, findKey) => {
    if (value.length){
       return options.filter(option => value.indexOf(option[findKey]) >= 0)
    }
    else{
       return [];
    }
}

 const handleChangeDate = (selectedOption) => setFilter({...filter, date: selectedOption.value});
 
 const handleChangeRate = (selectedOption) => setFilter({...filter, rate: selectedOption.value});

 const handleChangeCategories = (selectedOption) => setFilter({...filter, categories: selectedOption.map(item => item.id)});

 const handleChangeSubjects = (selectedOption) => setFilter({...filter, subjects: selectedOption.map(item => item.id)});

 const handleChangePopular = (selectedOption) => setFilter({...filter, popular: selectedOption.value});

 const handleLimit = (selectedOption) => setFilter({...filter, limit: selectedOption.value});
 
 const handleResetFilter = (e) => {
  e.preventDefault();
  setFilter({...filter,
      date: '',
      categories: [],
      subjects: [],
      popular: '',
      rate: '',
      limit: 10,
  });
}

const closeFilterMenuHandler = (e) => {
  e.preventDefault();
  setFilterIsOpen(false);
}
 
const openFilterMenuHandler = (e) => {
  e.stopPropagation();
  setFilterIsOpen(true);
}


    useEffect(() => {
     fetchSelectValues();
     //eslint-disable-next-line
    }, []);

    useEffect(() => {
      const handleClickOutsideFilter = (e) => {
        if (e.target && !filterRef.current?.contains(e.target)) setFilterIsOpen(false); 
      }

      document.addEventListener('click', handleClickOutsideFilter);

      return () => document.removeEventListener('click', handleClickOutsideFilter);
    }, []);
  
  return (
    <div className={cl.filter__wrapper}>
    {
      currentWidth < 800 && <div className={cl.filter__menu}>
      <button onClick = {openFilterMenuHandler} 
      className={cl.icon__button}>Фильтры <FaArrowDownWideShort /></button>
      <button onClick={handleResetFilter}
      className={cl.icon__button}>Сбросить <FaArrowRotateLeft /></button>
      </div>
    }
    <div ref={filterRef} 
    className={filterIsOpen ? [cl.post__filter, cl.active].join(' ') : cl.post__filter}
    onClick={e => e.stopPropagation()}>
    <form className={cl.post__filter__form}>
    {
      isLoading ? [...new Array(6)].map((_, i) => <FilterLoader key={i} />)
      : (error.error || error.errors.length) ? <ErrorHandler />
      : 
      <>
    <Select
    classNamePrefix="custom-select"
    options={staticOptions.popular} 
    onChange={handleChangePopular}
    value={getSelectedValue(staticOptions.popular, filter.popular)}
    />
    <Select
    classNamePrefix="custom-select" 
    options={staticOptions.date}
    onChange={handleChangeDate}
    value={getSelectedValue(staticOptions.date, filter.date)}
    />
    <Select 
    classNamePrefix="custom-select"
    options={staticOptions.rate}
    onChange={handleChangeRate}
    value={getSelectedValue(staticOptions.rate, filter.rate)}
    />
    <Select 
    classNamePrefix="custom-select"
    options={categories}
    onChange={handleChangeCategories}
    isMulti
    getOptionLabel={(option) => option.name}
    getOptionValue={(option) => option.id}
    placeholder = 'Поиск по категориям...'
    value={getSelectedMultiValues(categories, filter.categories, 'id')}
    />
    <Select 
    classNamePrefix="custom-select"
    options = {subjects}
    onChange={handleChangeSubjects}
    isMulti
    getOptionLabel={(option) => option.subject_name}
    getOptionValue={(option) => option.id}
    placeholder = 'Поиск по тематике...'
    value={getSelectedMultiValues(subjects, filter.subjects, 'id')}
    />
    <Select 
    classNamePrefix="custom-select"
    options={staticOptions.limit}
    onChange={handleLimit}
    value={getSelectedValue(staticOptions.limit, filter.limit)}
      />
      </>
    }
      {
        currentWidth < 800 && <div className={cl.filter__buttons}>
        <button onClick={handleResetFilter} className={cl.filter__buttons__button}>Сбросить</button>
        <button onClick={closeFilterMenuHandler} className={cl.filter__buttons__button}>Применить</button>
        </div>
      }
     </form>
    </div>
    </div>
  )
}


export default PostFilter;