import Vue from 'vue'
import Router from 'vue-router'
import Application from '@/views/app/Application'
import Auth from '@/views/auth/Auth'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Application,
            children: [
                {
                    path: 'profile',
                    meta: {tabId : 1},
                    component: () => import('@/views/app/Profile')
                },
                {
                    path: 'upload_accept_and_shipment',
                    meta: {tabId : 2},
                    component: () => import('@/views/app/UploadAcceptAndShipment')
                },
                {
                    path: 'email_newsletter',
                    meta: {tabId : 3},
                    component: () => import('@/views/app/EmailNewsletter')
                },
                {
                    path: 'load_tables',
                    meta: {tabId : 4},
                    component: () => import('@/views/app/LoadTables')
                },
                {
                    path: 'power_of_attorney',
                    meta: {tabId : 5},
                    component: () => import('@/views/app/PowerOfAttorney')
                }
            ]
        },
        {
            path: '/auth/',
            component: Auth,
            children: [
                {
                    path: 'login',
                    component: () => import('@/views/auth/Login')
                },
                {
                    path: 'register',
                    component: () => import('@/views/auth/Register')
                }
            ]
        }
    ]
})