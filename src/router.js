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
                    component: () => import('@/views/app/Profile')
                },
                {
                    path: 'accept_and_shipment',
                    component: () => import('@/views/app/AcceptAndShipment')
                },
                {
                    path: 'capacity',
                    component: () => import('@/views/app/Capacity')
                },
                {
                    path: 'power_of_attorney',
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