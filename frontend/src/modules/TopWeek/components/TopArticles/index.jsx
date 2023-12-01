import { useEffect, useState, memo } from "react";
import { useFetching } from '../../../../hooks/useFetching';
import PostService from "../../../../services/PostService";
import ShortPostItem from '../../../../components/ShortPostItem';
import CircleLoader from '../../../../shared/Loaders/CircleLoader';
import FetchDataLoader from '../../../../components/FetchDataLoader';
import cl from './TopArticles.module.scss';

const TopArticles = () => {

  const [articles, setArticles] = useState([]);

  const [isLoading, error, fetchTopArticles] = useFetching(async () => {
    const topArticles = await PostService.getTopArticles();
    setArticles(topArticles.data);
  })
  

  useEffect(() => {
   fetchTopArticles();
   // eslint-disable-next-line
  }, []);

  return (
    <div className={cl.articles__container}>
      <h4 className={cl.topArticles__title}>Публикации</h4>
      <div className={cl.topArticles}>
      <FetchDataLoader 
      data={articles}
      loading={isLoading}
      error={error}
      loader={[...new Array(5)].map((_, i) => <CircleLoader key={i} size={50} />)}
      noItems={<h3>Здесь еще ничего нет</h3>}
      dataItem={(post) => <ShortPostItem key={post.id} post={post} />}
      />
    </div>
    </div>
  )
}

export default memo(TopArticles);

