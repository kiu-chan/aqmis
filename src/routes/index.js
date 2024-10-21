import Home from '../pages/Home';
import Login from '../pages/Account/Login';
import Library from '../pages/Library';
import PostDetail from '../pages/Library/PostDetail';
import AddPost from '../pages/Library/AddPost';
import Map from '../pages/Map';
import EditPost from '../pages/Library/EditPost';
import News from '../pages/News/';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/map', component: Map },
    { path: '/login', component: Login },
    { path: '/thu-vien', component: Library },
    { path: '/library/post/:id', component: PostDetail },
    { path: '/add-post', component: AddPost },
    { path: '/library/edit-post/:id', component: EditPost },

    { path: '/tin-tuc', component: News },
    { path: '/news/edit-post/:id', component: EditPost },
    { path: '/edit-post/:id', component: EditPost },
    { path: '/news/post/:id', component: PostDetail },
]

export { publicRoutes }