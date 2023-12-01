import { memo} from 'react';
import cl from './RangeSlider.module.scss';

const RangeSlider = ({min, max, currentValue, changeHandler, title}) => {

const handleRangeChange = (e) => {
 changeHandler(e.target.value);
};


  return (
    <div className={cl.range__slider}>
     <div className={cl.range__slider__header}>
     <h3>{title}</h3>
     <span><small>Текущий: {currentValue}</small></span>
     </div>
     <div className={cl.range__slider__body}>
      <span className={cl.slider__body__range}>{min}</span>
     <input type='range' min={min} max={max} value={currentValue} onChange={handleRangeChange} />
     <span className={cl.slider__body__range}>{max}</span>
     </div>
    </div>
  )
}

export default memo(RangeSlider);