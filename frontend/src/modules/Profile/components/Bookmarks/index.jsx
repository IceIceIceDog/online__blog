import { useState, useEffect, useCallback } from "react";
import { useFetching } from '../../../../hooks/useFetching';
import { usePagination } from "../../../../hooks/usePagination";
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { useScroll } from '../../../../hooks/useScroll';
import BookmarkService from "../../../../services/BookmarkService";
import UserService from '../../../../services/UserService';
import PostItem from "../../../../components/PostItem";
import Pagination from "../../../../components/Pagination";
import PostLoader from '../../../../shared/Loaders/PostLoader';
import NoItems from '../../../../shared/UI/NoItems';
import FetchDataLoader from '../../../../components/FetchDataLoader';
import ScrollButton from '../../../../shared/UI/ScrollButton';
import cl from './Bookmarks.module.scss';


const Bookmarks = () => {
  
  const {id} = useParams();

  const user = useSelector(state => state.user.user);

  const [bookmarks, setBookmarks] = useState({data: [], count: null});

  const [scrollButtonIsVisible, setScrollButtonisVisible] = useScroll(1500);

  const [isLoading, error, fetchBookmarks] = useFetching(async () => {
    const bookmarks = await BookmarkService.getAll(id, paginationSettings.limit, paginationSettings.offset);
    setBookmarks({data: bookmarks.data.rows, count: bookmarks.data.count});
  });

  const [paginationSettings, setPaginationSettings] = useState({limit: 10, offset: 0});

  const pages = usePagination(bookmarks.count, paginationSettings.limit, paginationSettings.offset);

  const handlePage = offset => setPaginationSettings({...paginationSettings, offset});

  const handleBookmark = useCallback(async (postId, type, bookmarkId= null) => {
    const newState = [...bookmarks.data];
    const index = newState.findIndex(post => post.id === postId);
    switch (type){
      case 'add':
        const bookmark = await BookmarkService.addBookmark(postId, user.id);
        newState[index].posts_in_bookmarks[0] = {id: bookmark.id};
        newState[index].bookmark += 1;
        setBookmarks({...bookmarks, data: newState});
      break;
      case 'delete':
        const deletedBookmark = await BookmarkService.deleteBookmark(bookmarkId);
        if (deletedBookmark > 0){
        newState[index].posts_in_bookmarks = [];
        newState[index].bookmark -= 1;
        setBookmarks({...bookmarks, data: newState});
        if (user.id === +id) setBookmarks({...bookmarks, data: bookmarks.data.filter(bookmark => bookmark.id !== postId )});
        }
        break;
        default: 
        return;
    } 
}, [bookmarks, user.id, id]);
  

  const handleLike = useCallback(async (postId, like) => {
    try{
      const postLikes = await UserService.setPostLike(postId, user.id, like);
      const newState = [...bookmarks.data];
      const index = newState.findIndex(post => post.id === postId);
      newState[index] = {...bookmarks.data[index], 
      likes: postLikes.likes,
      dislikes: postLikes.dislikes,
     }
     newState[index].user_post_likes[0] = {...newState[index].user_post_likes[0], 
      like: postLikes.postLikeState.like,
      dislike: postLikes.postLikeState.dislike,
     }
      setBookmarks({...bookmarks, data: newState});
      
    }
    catch(e){
     console.log(e);
    }
 }, [bookmarks, user.id]);

 useEffect(() => {
  fetchBookmarks();
  // eslint-disable-next-line
 }, [paginationSettings]);



  return (
    <div className={cl.bookmarks__wrapper}>
    <FetchDataLoader 
    data={bookmarks.data}
    loading={isLoading}
    error={error}
    noItems={<NoItems type="search" message="У вас нет ни одной закладки" size={150} />}
    loader={[...new Array(paginationSettings.limit)].map((_, i) => <PostLoader key={i} />)}
    dataItem={(bookmark) => <PostItem key={bookmark.id} 
    post={bookmark}
    likeHandler={handleLike}
    bookmarkHandler={handleBookmark}
    />}
    />
    <ScrollButton isVisible={scrollButtonIsVisible}changevisible={setScrollButtonisVisible}/>
    {
      pages > 1 && <Pagination pages={pages} handlePage={handlePage} currentPage={paginationSettings.offset} />
    }
    </div>
  )
}

export default Bookmarks;

