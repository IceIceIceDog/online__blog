import cl from './CircleLoader.module.scss';

const CircleLoader = ({size, elementHeight = null}) => {
  return (
    <div className={cl.loader__container} style={elementHeight ? {height: elementHeight} : null}>
    <div style={{width: size, height: size}} className={cl.circle__loader}></div>
    </div>
  )
}

export default CircleLoader