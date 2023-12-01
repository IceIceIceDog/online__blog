import { useRef, useState } from 'react';

export const useDebounce = (callback, delay) => {
   
    const timer = useRef(null);

    const [timeoutIsOver, setTimeoutIsOver] = useState(false);

    const debauncedCallback = (...args) => {
        
        if (timer.current) {
            clearTimeout(timer.current);
            setTimeoutIsOver(false);
        }
        
        timer.current = setTimeout(async () => {
            setTimeoutIsOver(true);
            await callback(...args);
        }, delay)
    }
  
    return [debauncedCallback, timeoutIsOver];
}