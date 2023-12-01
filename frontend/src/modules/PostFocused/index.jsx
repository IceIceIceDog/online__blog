import { useEffect, useState } from "react";
import PostComments from '../../components/PostComments';
import PostService from '../../services/PostService';
import UserService from '../../services/UserService';
import BookmarkService from '../../services/BookmarkService';
import SubscribeService from '../../services/SubscribeService';
import { useFetching } from "../../hooks/useFetching";
import cl from './PostFocused.module.scss';
import PostDetail from "../../components/PostDetail";
import PostDetailLoader from '../../shared/Loaders/PostDetailLoader';
import NotFound from '../../shared/UI/NotFound';
import ErrorHandler from '../../shared/UI/ErrorHandler';
import { useSelector } from 'react-redux';


const PostFocused = ({postId}) => {

  const [post, setPost] = useState(null);

  const [isLoading, error, fetchPost] = useFetching(async () => {
    const postData = await PostService.getOne(postId);
    setPost({...post, ...postData.data});
  });

  const user = useSelector(state => state.user.user);
  
  useEffect(() => {
    fetchPost();
    //eslint-disable-next-line
  }, [postId]);

  const deletePost = () => PostService.deletePost(postId);

  const setPostLike = async (like) => {
      const postLikes = await UserService.setPostLike(post.id, user.id, like);
      
      const updatedLikes = post.user_post_likes[0];
      
      updatedLikes.like = postLikes.postLikeState.like;
      updatedLikes.dislike = postLikes.postLikeState.dislike;

      setPost({...post, 
        likes: postLikes.likes, 
        dislikes: postLikes.dislikes,
        user_post_likes: [updatedLikes]
      });
  }

  const handleBookmark = async (postId, type, bookmarkId=null) => {
    switch (type){
      case 'add':
      const newBookmark = await BookmarkService.addBookmark(postId, user.id);
      const posts_in_bookmarks = post.posts_in_bookmarks;
      posts_in_bookmarks[0] = newBookmark;
      setPost({...post,  bookmark: post.bookmark + 1, posts_in_bookmarks});
      break;
      case 'delete':
      const deletedBookmark = await BookmarkService.deleteBookmark(bookmarkId);
      if (deletedBookmark > 0) setPost({...post, bookmark: post.bookmark - 1, posts_in_bookmarks: []});
      break;
      default: 
      return;
    } 
}


 const handleSubscribe = async () => {
    const subscribe = await SubscribeService.subscribe(post.user.id, user.id);
    setPost({...post,  user: {...post.user, subscribers: [{id: subscribe.id}]}});
 }

 const handleUnsubscribe = async () => {
    const deletedSubscribe = await SubscribeService.unsubscribe(post.user.subscribers[0].id);
    if (deletedSubscribe > 0) setPost({...post, user: {...post.user, subscribers: []}});
 }

 
  return (
    <div className={cl.post__wrapper}>
    {
       isLoading 
       ? <PostDetailLoader  />
       : (error.error || error.errors.length) ? <ErrorHandler />
       : post?.id  ?
       <PostDetail post={post} 
       handleLike={setPostLike} 
       deleteHandler={deletePost} 
       handleBookmark={handleBookmark} 
       subscribe={handleSubscribe}
       unsubscribe={handleUnsubscribe}
       />
       : <NotFound />
    }
    {
      (!isLoading && post?.id) && <PostComments postId={post.id} />
    }
    </div>
  )
}

export default PostFocused;

