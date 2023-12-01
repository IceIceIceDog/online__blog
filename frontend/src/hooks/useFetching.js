import { useState } from 'react';

export const useFetching = callback => {

const [isLoading, setIsLoading] = useState(false);

const [error, setError] = useState({error: '', errors: []});

const fetchData = async () => {
    try{
        setIsLoading(true);
        await callback();
    }
    catch(e){
      setError({error: e.message, errors: e.errors});
    }
    finally{
        setIsLoading(false);
    }
}


 return [isLoading, error, fetchData];

}