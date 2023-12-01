import {useState, useEffect } from 'react';


const useResize = () => {
    const [currentWidth, setCurrentWidth] = useState(undefined);
    
    useEffect(() => {
      const handleResize = () => setCurrentWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }, []); 

   

    return currentWidth;
}

export default useResize;