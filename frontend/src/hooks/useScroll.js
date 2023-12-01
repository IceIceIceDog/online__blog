import { useState, useEffect} from 'react';

export const useScroll = (initialY) => {

 const [scrollButtonVisible, setScrollButtonVisible] = useState(false);

 const [currentY, setCurrentY] = useState(window.scrollY);
 
 useEffect(() => {
  const checkScroll = () => setCurrentY(window.scrollY);
  window.addEventListener('scroll', checkScroll);
  return () => window.removeEventListener('scroll', checkScroll);
 }, []);


 useEffect(() => {
  if (currentY > initialY) {
  if (!scrollButtonVisible) setScrollButtonVisible(true);
  }

  if (currentY < initialY && scrollButtonVisible) setScrollButtonVisible(false);
  //eslint-disable-next-line
 }, [currentY])

 return [scrollButtonVisible, setScrollButtonVisible];

}