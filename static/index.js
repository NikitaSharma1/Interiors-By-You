import login from './components/login.js'
import register from './components/register.js'
import homepage from './components/homepage.js'
import profile from './components/profile.js'
import search from './components/search.js'

const router = new VueRouter({
    routes: [
        { path: '/', component: homepage, name: 'homepage' },
        { path: '/login', component: login, name: 'login' },
        { path: '/register', component: register, name: 'register' },
        { path: '/profile', component: profile, name: 'profile' },
        { path: '/homepage', component: homepage, name: 'homepage' },
        { path: '/search/:user', component: search, name: 'search' },
        { path: '*', redirect: '/' }

    ],
    base: '/homepage'
})

new Vue({
    el: '#app',
    router: router
})