import Button from '../Button';
import cl from './ErrorHandler.module.scss';

const ErrorHandler = () => {
  return (
    <div className={cl.error__handle__container}>
    <h3 className={cl.error__title}>Произошла ошибка</h3>
    <Button onClick={() => window.location.reload()} style={{padding: "5px 10px"}}>Перезагрузить</Button>
    </div>
  )
}

export default ErrorHandler