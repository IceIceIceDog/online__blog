import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useFetching } from '../../hooks/useFetching';
import { usePagination } from '../../hooks/usePagination';
import { useScroll } from '../../hooks/useScroll';
import { useDebounce } from "../../hooks/useDebaunce";
import PostItem from '../../components/PostItem';
import Pagination from '../../components/Pagination';
import SearchInput from "./components/SearchInput";
import PostLoader from '../../shared/Loaders/PostLoader';
import CircleLoader from '../../shared/Loaders/CircleLoader';
import FetchDataLoader from '../../components/FetchDataLoader';
import PostService from "../../services/PostService";
import UserService from "../../services/UserService";
import BookmarkService from "../../services/BookmarkService";
import NoItems from "../../shared/UI/NoItems";
import ScrollButton from '../../shared/UI/ScrollButton';
import { motion, AnimatePresence } from 'framer-motion';
import cl from './Search.module.scss';

const SearchList = () => {

const user = useSelector(state => state.user.user);

const [searching, setSearching] = useState(false);

const [search, setSearch] = useState('');

const [posts, setPosts] = useState({data: [], count: null});

const [paginationSettings, setPaginationSettings] = useState({limit: 10, offset: 0});

const [scrollButtonIsVisible, setScrollButtonisVisible] = useScroll(1500);

const [pageTitleVisible, setPageTitleVisible] = useState(true);

const [isLoading, error, fetchSearchedPosts] = useFetching(async () => {
  const searchedPosts = await PostService.getAll(`?search=${search}&limit=${paginationSettings.limit}&offset=${paginationSettings.offset}`);
  setPosts({...posts, data: searchedPosts.data.rows, count: searchedPosts.data.count});
  
});

const [debauncedFetchSearchedPosts, endTimeout] = useDebounce(fetchSearchedPosts, 400);

const pages = usePagination(posts.count, paginationSettings.limit, paginationSettings.offset);

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


const handlePage = (offset) => setPaginationSettings({...paginationSettings, offset});


useEffect(() => {
document.title = "Поиск"
debauncedFetchSearchedPosts();
//eslint-disable-next-line
}, [search, paginationSettings]);

useEffect(() => {
setTimeout(() => setPageTitleVisible(false), 1500);
}, [])

  return (
    <div className={cl.search__wrapper}>
    <SearchInput searching ={searching} changeSearching={setSearching} searchValue={search} changeSearch={setSearch} />
    <div className={cl.post__list}>
     <AnimatePresence>
      {
        pageTitleVisible &&  !searching && 
        <motion.h1
        initial={{opacity: 0, y: -40}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.4, opacity: {duration: 0.3}, y: {duration: 0.3, delay: 0.4}}}
        exit={{opacity: 0, y: -40}}
        >Введите запрос для поиска</motion.h1>
      }
     </AnimatePresence>
     {
       (searching && endTimeout)
       && 
       <>
       <h1 className={cl.search__title}>Найдено: {isLoading ? <CircleLoader size={24} /> : posts.count}</h1>
       <FetchDataLoader 
       data={posts.data} 
       loading={isLoading} 
       error={error} 
       loader={[...new Array(paginationSettings.limit)].map((_, i) => <PostLoader key={i} />)} 
       noItems={<NoItems type="search" message="По вашему запросу ничего не найдено" />}
       dataItem={(post) => <PostItem key={post.id}  
       post={post}
       likeHandler={handleLike}
       bookmarkHandler={handleBookmark}
       />}
       />
       </>
     }
     {
      (pages.length > 1 && (searching && endTimeout)) && <Pagination pages={pages} currentPage={paginationSettings.offset} handlePage={handlePage} />
     }
    </div>
    <ScrollButton isVisible={scrollButtonIsVisible} changevisible={setScrollButtonisVisible} />
    </div>
  )
}

export default SearchList;