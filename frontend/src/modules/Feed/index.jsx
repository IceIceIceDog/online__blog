import { useState, useEffect, useCallback } from 'react';
import { useFetching } from '../../hooks/useFetching';
import { useScroll } from '../../hooks/useScroll';
import { usePagination } from '../../hooks/usePagination';
import { useCheckAuth } from '../../hooks/useCheckAuth';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import BookmarkService from '../../services/BookmarkService';
import FetchDataLoader from '../../components/FetchDataLoader';
import Pagination from '../../components/Pagination'
import PostItem from '../../components/PostItem';
import PostLoader from '../../shared/Loaders/PostLoader';
import ScrollButton from '../../shared/UI/ScrollButton';
import NoItems from '../../shared/UI/NoItems';
import cl from './Feed.module.scss';



const Feed = ({userId}) => {

  const [posts, setPosts] = useState({data: [], count: null});

  const [isLoading, error, fetchFeedPosts] = useFetching(async () => {
      const feed = await UserService.getFeed(userId, `?limit=${paginationSettings.limit}&offset=${paginationSettings.offset}`);
      setPosts({...posts, data: feed.rows, count: feed.count});
  });

  const [paginationSettings, setPaginationSettings] = useState({limit: 10, offset: 0});

  const pages = usePagination(posts.count, paginationSettings.limit, paginationSettings.offset);

  const [scrollButtonIsVisible, setScrollButtonisVisible] = useScroll(1500);

  const redirect = useNavigate();

  useCheckAuth(() => redirect('.'), false);

  const handleLike = useCallback(async (postId, like) => {
    try{
     const postLikes = await UserService.setPostLike(postId, userId, like);
      const newState = [...posts.data];
      const index = newState.findIndex(post => post.id === postId);
      newState[index] = {...posts.data[index], 
      likes: postLikes.likes,
      dislikes: postLikes.dislikes,
     }
     newState[index].user_post_likes[0] = {...newState[index].user_post_likes[0], 
      like: postLikes.postLikeState.like,
      dislike: postLikes.postLikeState.dislike,
     }
      setPosts({...posts, data: newState});   
      
    }
    catch(e){
     console.log(e);
    }
  }, [posts, userId]); 

  const handleBookmark = useCallback(async (postId, type, bookmarkId=null) => {
    const newState = [...posts.data];
    const index = newState.findIndex(post => post.id === postId);
    switch (type){
      case 'add':
        const bookmark = await BookmarkService.addBookmark(postId, userId);
        newState[index].posts_in_bookmarks[0] = {id: bookmark.id};
        newState[index].bookmark += 1;
        setPosts({...posts, data: newState});
      break;
      case 'delete':
        const deletedBookmark = await BookmarkService.deleteBookmark(bookmarkId);
        if (deletedBookmark > 0){
        newState[index].posts_in_bookmarks = [];
        newState[index].bookmark -= 1;
        setPosts({...posts, data: newState});
        }
        break;
        default: 
        return;
    } 
  }, [posts, userId]); 

  const handlePage = (offset) => setPaginationSettings({...paginationSettings, offset});

  useEffect(() => {
   document.title = "Лента";
   fetchFeedPosts();
   //eslint-disable-next-line
  }, [paginationSettings]);

  return (
    <div className={cl.feed__wrapper}>
    <h1 className={cl.feed__title}>Лента</h1>
    <div className={cl.feed__list}>
    <FetchDataLoader 
     data={posts.data}
     loading={isLoading}
     error={error}
     loader={[...new Array(paginationSettings.limit)].map((_, i) => <PostLoader key={i} />)}
     noItems={<NoItems type="search" message="В вашей ленте пока нет публикаций" />}
     dataItem={(post) => <PostItem 
     key={post.id}
     post={post}
     likeHandler={handleLike} 
     bookmarkHandler={handleBookmark}
     />}
    />
    </div>
    {pages.length > 1 && <Pagination currentPage={paginationSettings.offset} pages={pages} handlePage={handlePage} />}
    <ScrollButton isVisible={scrollButtonIsVisible} changevisible={setScrollButtonisVisible} />
    </div>
  )
}

export default Feed