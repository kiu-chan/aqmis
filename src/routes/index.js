import Home from '../pages/Home';
import Login from '../pages/Account/Login';
import Map from '../pages/Map';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/map', component: Map },
    { path: '/login', component: Login },
]

export { publicRoutes }