import ErrorHandler from '../../shared/UI/ErrorHandler';
const FetchDataLoader = ({data, loading, error, loader, noItems, dataItem}) => {
  return (
    <>
    {
        loading 
        ? loader
        : (error.error || error.errors.length) 
        ? <ErrorHandler />
        : data.length > 0
        ? data.map(dataItem) 
        : noItems
    }
    </>
  )
}

export default FetchDataLoader