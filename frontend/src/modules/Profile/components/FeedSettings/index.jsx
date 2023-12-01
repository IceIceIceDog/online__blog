import { useEffect, useState, useCallback } from "react";
import { useFetching } from '../../../../hooks/useFetching';
import { useSelector } from 'react-redux';
import UserService from '../../../../services/UserService';
import SubjectService from "../../../../services/SubjectService";
import CategoryService from "../../../../services/CategoryService";
import Select from 'react-select';
import Button from '../../../../shared/UI/Button';
import RangeSlider from "../../../../shared/UI/RangeSlider";
import Message from '../../../../shared/UI/Message';
import ErrorHandler from '../../../../shared/UI/ErrorHandler';
import CircleLoader from '../../../../shared/Loaders/CircleLoader';
import { motion } from 'framer-motion';
import cl from './FeedSettings.module.scss';

const lowRateOptions = [
  {label: 'Показывать', value: true},
  {label: 'Не показывать', value: false}
]

const FeedSettings = () => {

  const user = useSelector(state => state.user.user);

  const [subjects, setSubjects] = useState({selected: [], all: []});

  const [categories, setCategories] = useState({selected: [], all: []});

  const [options, setOptions] = useState({
    min_rate: 0,
    low_decency_user: false
  });

  const [reloadDataKey, setReloadDataKey] = useState(Math.random());

  const [messageVisible, setMessageVisible] = useState(false);

  const [msg, setMsg] = useState('');

  const [isLoading, error, fetchFeedOptions] = useFetching(async () => {
      const fetchOptions = await UserService.getFeedOptions(user.id);
      const categories = await CategoryService.getAll();
      const subjects = await SubjectService.getAll();
      setSubjects({...subjects, all: subjects, selected: fetchOptions.subjects});
      setCategories({...categories, all: categories.data, selected: fetchOptions.categories});
      setOptions({...options, min_rate: fetchOptions.settings.min_rate, low_decency_user: fetchOptions.settings.low_decency_user});
  });

  const updateFeedSettings = async (e) => {
    try{
      e.preventDefault();
       const updateFeedSettings = await UserService.updateFeedSettings({
        userId: user.id,
        settings: {
          subjects: subjects.selected,
          categories: categories.selected,
          min_rate: options.min_rate,
          low_decency_user: options.low_decency_user
        }
       });
       setSubjects({...subjects, selected: updateFeedSettings.subjects});
      setCategories({...categories, selected: updateFeedSettings.categories});
      setOptions({...options, min_rate: updateFeedSettings.settings.min_rate, low_decency_user: updateFeedSettings.settings.low_decency_user});
      setMsg('Настройки профиля обновлены');
    }
    catch(e){
      setMsg('Произошла ошибка');
    }
    finally{
      setMessageVisible(true);
    }
  }

  const cancelUpdate = (e) => {
    e.preventDefault();
    setReloadDataKey(Math.random());
  }

  const handleChangeCategories = (selectedValue) => setCategories({...categories, selected: selectedValue});

  const handleChangeSubjects = (selectedValue) => setSubjects({...subjects, selected: selectedValue});

  const handleChangeLowRate = (selectedValue) => setOptions({...options, low_decency_user: selectedValue.value});

  const handleChangeRate = useCallback((value) => setOptions(prev => ({...prev, min_rate: value})), []);

  const getSelectedValue = (options, value) => {
    return options.find(option => option.value === value);
  }

 
  useEffect(() => {
  fetchFeedOptions();
  //eslint-disable-next-line
  }, [reloadDataKey]);

  return (
    <motion.div 
    initial={{opacity: 0, y: -15}}
    animate={{opacity: 1, y: 0}}
    exit={{opacity: 0, y: -15 }}
    transition={{duration: 0.5}}
    className={cl.feed__settings__wrapper}>
      <form name="feed__settings" className={cl.settings__form}>
      {
          isLoading ? <CircleLoader size={100} elementHeight={"30vh"} />
          : (error.error || error.errors.length) ? <ErrorHandler />
          : <>
          <Select 
          classNamePrefix="custom-select"
          isMulti
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          options={categories.all}
          onChange={handleChangeCategories}
          value={categories.selected}
          placeholder="Выберите категорию"
          />
          <Select 
          classNamePrefix="custom-select"
          isMulti
          getOptionLabel={(option) => option.subject_name}
          getOptionValue={(option) => option.id}
          options={subjects.all}
          onChange={handleChangeSubjects}
          value={subjects.selected}
          placeholder="Выберите тематику"
          />
          <Select 
          classNamePrefix="custom-select"
          options={lowRateOptions}
          onChange={handleChangeLowRate}
          value={getSelectedValue(lowRateOptions, options.low_decency_user)}
          />
          <RangeSlider title="Порог рейтинга" min={0} max={100} currentValue={options.min_rate} changeHandler={handleChangeRate} />
          </>
        }
        <div className={cl.feed__settings__buttons}>
        <Button onClick={updateFeedSettings} style={{padding: "5px 10px"}}>Обновить</Button>
        <Button onClick={cancelUpdate} style={{padding: "5px 10px"}} styles="inverse">Отмена</Button>
        </div>
      </form>
      {messageVisible && <Message message={msg} isVisible={messageVisible} handleIsVisible={setMessageVisible} delay={3000} />}
    </motion.div>
  )
}

export default FeedSettings;