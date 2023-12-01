import cl from './Input.module.scss';

const Input = ({changeHandler, value, placeholder, type = "input", isPassword = false, ...props}) => {
  const setInputValue = (e) => changeHandler(e.target.value);
  switch (type){
    case 'input':
      return (
        <input type={isPassword ? "password" : "text"} 
        {...props} 
        value={value} 
        onChange={setInputValue}
        placeholder={placeholder}
        className={cl.text__input}
        /> 
      )
    case 'textarea':
      return (
        <textarea {...props} 
        value={value} 
        onChange={setInputValue}
        placeholder={placeholder}
        className={cl.text__input}
        /> 
      )
      default:
        return (
          <p>Неверный тип</p>
        )
  }
}

export default Input