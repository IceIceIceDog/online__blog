import { ReactComponent as Select } from '../../../assets/images/select.svg';
import cl from './Filter.module.scss';

const FilterLoader = () => {
  return (
    <div className={cl.ibg__select}>
    <Select />
    </div>
    
  )
}

export default FilterLoader;