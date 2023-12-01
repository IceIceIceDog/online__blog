import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {useState, useEffect, useCallback } from 'react';
import { useFetching } from '../../../../hooks/useFetching';
import { usePagination } from '../../../../hooks/usePagination';
import { useScroll } from '../../../../hooks/useScroll';
import PostService from '../../../../services/PostService';
import UserService from '../../../../services/UserService';
import BookmarkService from '../../../../services/BookmarkService';
import PostItem from '../../../../components/PostItem';
import Pagination from '../../../../components/Pagination';
import PostLoader from '../../../../shared/Loaders/PostLoader';
import FetchDataLoader from '../../../../components/FetchDataLoader';
import NoItems from '../../../../shared/UI/NoItems';
import ScrollButton from '../../../../shared/UI/ScrollButton';
import cl from './Articles.module.scss';

const Articles = () => {
   
  const {id} = useParams();

  const user = useSelector(state => state.user.user);

  const [posts, setPosts] = useState({data: [], count: null});

  const [scrollButtonIsVisible, setScrollButtonisVisible] = useScroll(1500);

  const [paginationSettings, setPaginationSettings] = useState({offset: 0, limit: 10});

  const [isLoading, error, fetchData] = useFetching(async () => {
    const userPosts = await PostService.getAll(`?authorId=${id}&offset=${paginationSettings.offset}&limit=${paginationSettings.limit}`);
    setPosts({...posts, data: userPosts.data.rows, count: userPosts.data.count});
  });

  const pages = usePagination(posts.count, paginationSettings.limit, paginationSettings.offset);

  const handleBookmark = useCallback(async (postId, type, bookmarkId=null) => {
    const newState = [...posts.data];
    const index = newState.findIndex(post => post.id === postId);
    switch (type){
      case 'add':
        const bookmark = await BookmarkService.addBookmark(postId, user.id);
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
}, [posts, user.id]);

  const handleLike = useCallback(async (postId, like) => {
    try{
      const postLikes = await UserService.setPostLike(postId, user.id, like);
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
 }, [posts, user.id]);

 const handlePage = (offset) => setPaginationSettings({...paginationSettings, offset});

 useEffect(() => {
  fetchData();
  // eslint-disable-next-line
 }, [paginationSettings]);
  
  return (
    <div className={cl.posts__wrapper}>
    <FetchDataLoader 
    data={posts.data}
    loading={isLoading}
    error={error}
    noItems={<NoItems type="search" message="Вы не опубликовали ни одного поста" size={150}/>}
    loader={[...new Array(paginationSettings.limit)].map((_, i) => <PostLoader key={i} />)}
    dataItem={(post) => <PostItem key={post.id} 
    post={post}
    likeHandler={handleLike}
    bookmarkHandler={handleBookmark}
    />}
    />
      {
        pages.length > 1 && <Pagination pages={pages} handlePage={handlePage} currentPage={paginationSettings.offset}/>
      }
    <ScrollButton isVisible={scrollButtonIsVisible} changevisible={setScrollButtonisVisible} />
    </div>
  )
}

export default Articles;

