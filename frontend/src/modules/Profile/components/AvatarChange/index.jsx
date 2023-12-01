import { useState } from 'react';
import useResize from '../../../../hooks/useResize';
import Avatar from 'react-avatar-edit';
import Button from '../../../../shared/UI/Button';
import cl from './AvatarChange.module.scss';





const AvatarChange = ({updateHandler}) => {
  
  const [preview, setPreview] = useState(null);


  const [imgSelected, setImgSelected] = useState(false);

  const onCrop = preview => setPreview(preview);

  const onClose = () => setImgSelected(true);

  const currentWidth = useResize();

  const imageEditorWidth = currentWidth <= 800 ? 300 : 500;

  const updateImage = () => {
     updateHandler({avatar_img: preview});
     setPreview(null);
     setImgSelected(false);
  }

  const cancelUpdate = () => {
    setImgSelected(false);
    setPreview(null);
  }

  return (
      
    <div className={cl.avatar__change__process}>
        {
            imgSelected ? 
            <div className={cl.imageSelected__block}>
             <div className={cl.ibg__user}>
                <img src={preview} alt='Выбранное изображение'/>
             </div>
             <div className={cl.imageSelected__block__buttons}>
             <Button onClick={updateImage} style={{padding: '5px 10px'}}>Обновить</Button>
             <Button onClick={cancelUpdate} styles='inverse' style={{padding: '5px 10px'}}>Отмена</Button>
             </div>
            </div>
            : <Avatar 
              width={imageEditorWidth}
              height={imageEditorWidth / 2}
              imageWidth={imageEditorWidth}
              label="Выберите изображение"
              labelStyle={{color: 'var(--color-default)', fontSize: currentWidth <=800 ? '16px' : '24px', fontWeight:'500'}}
              src={null}
              onClose={onClose}
              onCrop={onCrop}
            />
        }
    </div>

  )
}

export default AvatarChange;