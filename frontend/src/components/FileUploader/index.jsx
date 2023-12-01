import { useState, useRef } from "react";
import cl from './FileUploader.module.scss';
import {FaPencil, FaXmark } from 'react-icons/fa6';

const FileUploader = ({initialSource, uploadHandler}) => {

  const [imageData, setimageData] = useState(null);
  const [uploadName, setName] = useState('');
  const inputRef = useRef();
  const clearFile = (e) => {
    e.preventDefault();
    uploadHandler(null);
    setimageData(null);
  }

  const openFileUploader = (e) => {
    e.preventDefault();
    inputRef.current?.click();
  }

  return (
    <div className={cl.upload__wrapper}>
    <div onClick={() => inputRef.current?.click()} className={imageData || initialSource ? [cl.upload__container, cl.active].join('') : cl.upload__container }>
    <input ref={inputRef} type="file" accept="image/*" 
    onChange={e => {
      if (e.target.files[0]){
        setName(e.target.files[0].name);
        setimageData(URL.createObjectURL(e.target.files[0]));
        uploadHandler(e.target.files[0]);
      }
    }}
    hidden/>
    {
        (initialSource || imageData) &&  <div className={cl.ibg__post}>
            <img src={imageData ? imageData : `http://localhost:7000/${initialSource}`} alt="Выбранное фото" />
        </div>
    }
    </div>
    <div className={cl.uploader__buttons}>
        <button className={cl.filename__button} 
        onClick={openFileUploader}>
            <span className={cl.filename}>{imageData ? uploadName : initialSource || 'Нет выбранных файлов'}</span>
            <FaPencil/></button>
        <button className={cl.icon__button} onClick={clearFile}><FaXmark /></button>
        </div>
        </div>
  )
}

export default FileUploader;