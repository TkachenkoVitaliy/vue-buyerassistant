import Vue from 'vue'
import Router from 'vue-router'
import Application from '@/views/app/Application'
import Auth from '@/views/auth/Auth'
import Profile from '@/views/Profile'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Application,
            children: [{
                path: 'profile',
                component: Profile
            }]
        },
        {
            path: '/auth*',
            component: Auth
        }
    ]
})