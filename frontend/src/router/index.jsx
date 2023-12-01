import { lazy, Suspense } from 'react';
import {Routes, Route} from 'react-router-dom';
import Layout from '../shared/Layouts';
import PostEdit from '../pages/PostEdit';
import NewPost from '../pages/NewPost';
import PageLoader from '../shared/Loaders/PageLoader';
import CircleLoader from '../shared/Loaders/CircleLoader';
import RequireAuth from '../hoc/RequireAuth';
const Main = lazy(() => import('../pages/Main'));
const Search = lazy(() => import('../pages/Search'));
const Post = lazy(() => import('../pages/Post'));
const Login = lazy(() => import('../pages/Login'));
const Registration = lazy(() => import('../pages/Registration'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const Index = lazy(() => import('../modules/Profile/components/Index'));
const Articles = lazy(() => import('../modules/Profile/components/Articles'));
const Comments = lazy(() => import('../modules/Profile/components/Comments'));
const Bookmarks = lazy(() => import('../modules/Profile/components/Bookmarks'));
const Messages = lazy(() => import('../modules/Profile/components/Messages'));
const Subscribes = lazy(() => import('../modules/Profile/components/Subcribes'));
const Subscribers = lazy(() => import('../modules/Profile/components/Subscribers'));
const Feed = lazy(() => import('../pages/ProfileFeed'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));



const Router = () => {
  return (
    <Routes>
    <Route element={<Layout type="default"/>}>
    <Route path='/' element={<Suspense fallback={<PageLoader />}><Main /></Suspense>} />
    <Route path='/posts/:id' element={<Suspense fallback={<PageLoader />}><Post /></Suspense>} />
    <Route path='/feed' element={<Suspense fallback={<PageLoader />}><Feed /></Suspense>} />
    </Route>
    <Route element={<Layout type="unset"/>}>
    <Route path='/search' element={<Suspense fallback={<PageLoader />}><Search /></Suspense>} />
    <Route path='/posts/:id/edit' element={<RequireAuth isAuthor><PostEdit /></RequireAuth>} />
    <Route path='/posts/create' element={<RequireAuth><NewPost /></RequireAuth>} />
    <Route exact path='/profile/:id/*' element={<Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>}>
    <Route index exact element={<Suspense fallback={<CircleLoader size={100} elementHeight="30vh" />}><Index /></Suspense>} />
    <Route path='posts' element={<Suspense fallback={<CircleLoader size={100} elementHeight="30vh" />}><Articles /></Suspense>} />
    <Route path='comments' element={<Suspense fallback={<CircleLoader size={100} elementHeight="30vh" />}><Comments /></Suspense>} />
    <Route path='bookmarks' element={<Suspense fallback={<CircleLoader size={100} elementHeight="30vh" />}><Bookmarks /></Suspense>} />
    <Route path='messages' element={<Suspense fallback={<CircleLoader size={100} elementHeight="30vh" />}><Messages /></Suspense>} />
    <Route path='subscribes' element={<Suspense fallback={<CircleLoader size={100} elementHeight="30vh" />}><Subscribes /></Suspense>} />
    <Route path='subscribers' element={<Suspense fallback={<CircleLoader size={100} elementHeight="30vh" />}><Subscribers /></Suspense>} />
    <Route path='*' element={<Suspense fallback={<CircleLoader size={100} elementHeight="30vh" />}><NotFoundPage /></Suspense>} />
    </Route>
    </Route>
    <Route path="/account" element={<Layout type="signup" />}>
    <Route path='login' element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
    <Route path='registration' element={<Suspense fallback={<PageLoader />}><Registration /></Suspense>} />
    </Route>
    <Route element={<Layout type="signup" />}>
    <Route path='*' element={<Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>} />
    </Route>
    </Routes>
  )
}

export default Router;