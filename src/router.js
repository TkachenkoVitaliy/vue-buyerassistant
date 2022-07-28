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
                    path: 'accept_and_shipment',
                    meta: {tabId : 2},
                    component: () => import('@/views/app/AcceptAndShipment')
                },
                {
                    path: 'email_newsletter',
                    meta: {tabId : 3},
                    component: () => import('@/views/app/EmailNewsletter')
                },
                {
                    path: 'capacity',
                    meta: {tabId : 4},
                    component: () => import('@/views/app/Capacity')
                },
                {
                    path: 'power_of_attorney',
                    meta: {tabId : 5},
                    component: () => import('@/views/app/PowerOfAttorney')
                }
            ]
        },
        {
            path: '/auth*',
            component: Auth
        }
    ]
})