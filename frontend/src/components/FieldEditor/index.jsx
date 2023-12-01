import { useState, lazy, Suspense } from "react";
import Input from '../../shared/UI/Input';
import {FaXmark, FaCheck} from 'react-icons/fa6';
import cl from './FieldEditor.module.scss';
const TextEditor = lazy(() => import('../../shared/UI/TextEditor'));

const FieldEditor = ({title, value, changeHandler, type="default"}) => {
  
  const [updatedValue, setUpdatedValue] = useState(value);

  const updateField = (e) => {
    e.preventDefault();
    changeHandler(updatedValue);
}

  const cancelUpdate = (e) => {
    e.preventDefault();
    setUpdatedValue(value);
  }
  
    switch (type){
      case "default": 
      return (
        <div className={cl.edit__field}>
        <h2 className={cl.edit__field__title}>{title}</h2>
        <Input value={updatedValue} changeHandler={setUpdatedValue} type="textarea"/>
        <div className={cl.edit__field__buttons}>
        <button onClick={updateField} className={cl.icon__button}><FaCheck /></button>
        <button onClick={cancelUpdate} className={cl.icon__button}><FaXmark /></button>
        </div>
       </div>
         )
      case "editor":
        return (
          <div className={[cl.edit__field, cl.ckeditor].join(' ')}>
          <h2 className={cl.edit__field__title}>{title}</h2>
          <Suspense fallback={<h1>Загрузка</h1>}><TextEditor value={updatedValue} changeHandler={changeHandler}/></Suspense>
         </div>
           )
      default:
        return <></>
    }
 
}

export default FieldEditor