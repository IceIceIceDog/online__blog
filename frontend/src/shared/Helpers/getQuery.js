export const getQuery = (filter) => {
    let query = ``;
     for (let key of Object.keys(filter)) {
        if (filter[key] !== '' || filter[key].length > 0){
            query+= Array.isArray(filter[key])
            ? `${key}=${filter[key].join(',')}&`
            : `${key}=${filter[key]}&`;
        }
     }
     if (query !== '') query = '?' + query;
     if (query[query.length - 1] === '&') query = query.slice(0, query.length - 1);
     return query;
    }