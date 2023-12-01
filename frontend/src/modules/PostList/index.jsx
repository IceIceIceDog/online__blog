
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useFetching } from '../../hooks/useFetching';
import { getQuery } from '../../shared/Helpers/getQuery';
import { usePagination } from '../../hooks/usePagination';
import { useScroll } from '../../hooks/useScroll';
import PostService from '../../services/PostService';
import BookmarkService from '../../services/BookmarkService';
import UserService from '../../services/UserService';
import PostFilter from '../../components/PostFilter';
import PostItem from '../../components/PostItem';
import Pagination from '../../components/Pagination';
import PostLoader from '../../shared/Loaders/PostLoader';
import NoItems from '../../shared/UI/NoItems';
import FetchDataLoader from '../../components/FetchDataLoader';
import ScrollButton from '../../shared/UI/ScrollButton';
import cl from './PostList.module.scss';


const PostList = () => {
const [posts, setPosts] = useState({data: [], count: null});
const [filter, setFilter] = useState({
  date: '',
  categories: [],
  subjects: [],
  popular: '',
  rate: '',
  offset: 0,
  limit: 10
});

const [scrollButtonIsVisible, setScrollButtonIsVisible] = useScroll(1500);

const [isLoading, error, fetchPosts] = useFetching(async () => {
   const query = getQuery(filter);
   const postsData = await PostService.getAll(query);
   setPosts({...posts, data: postsData.data.rows, count: postsData.data.count})
});

const user = useSelector(state => state.user.user);

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

const handlePage = (offset) => setFilter({...filter, offset});

const selectSubject = (id) => setFilter({...filter, subjects: [...filter.subjects, id]});

useEffect(() => {
    document.title = "Все посты";
    fetchPosts();
    //eslint-disable-next-line
}, [filter]);

const pages = usePagination(posts.count, filter.limit, filter.offset);

  return (
    <div className={cl.posts__wrapper}>
    <h1 className={cl.postlist__title}>Все посты</h1>
    <PostFilter filter={filter} setFilter={setFilter} />
    <div className={cl.post__list}>
    <FetchDataLoader 
    data={posts.data}
    loading={isLoading}
    error={error}
    loader={[...new Array(filter.limit)].map((_, i) => <PostLoader key={i} />)}
    noItems={<NoItems type="search" message="Ничего не найдено"/>}
    dataItem={(post) => <PostItem key={post.id}
    post={post}
    likeHandler={handleLike} 
    bookmarkHandler={handleBookmark} 
    selectSubject={selectSubject}
    />}
    />
    </div>
    {
     pages?.length > 1 && <Pagination handlePage={handlePage} pages={pages} currentPage={filter.offset} />
    }
    <ScrollButton isVisible={scrollButtonIsVisible} changevisible={setScrollButtonIsVisible} />
    </div>
  )
}

export default PostList;