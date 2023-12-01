import { useRef, useEffect, useState } from 'react';
import cl from './ScrollButton.module.scss';
import { FaChevronUp } from 'react-icons/fa6';

const ScrollButton = ({isVisible, changevisible}) => {

  const timeOutRef = useRef(null);

  const [buttonIsTarget, setButtonIsTarget] = useState(false);

  const handleMouseOver = () => {
    setButtonIsTarget(true);
    clearTimeout(timeOutRef.current);
  }

  const handleMouseOut = () => {
    setButtonIsTarget(false);
    timeOutRef.current = setTimeout(() => changevisible(false), 1500);
  }
   
  const setScroll = () => window.scrollTo({top: 0, behavior: "smooth"});

  const buttonClassList = isVisible ? [cl.scroll__button, cl.visible] : [cl.scroll__button];

  useEffect(() => {
   if (isVisible && !buttonIsTarget) timeOutRef.current = setTimeout(() => changevisible(false), 1500);
  }, [isVisible, buttonIsTarget, changevisible]);
  
  return (
   <button onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={setScroll} className={buttonClassList.join(' ')} >
   <FaChevronUp />
   </button>
  )
}

export default ScrollButton;