import Vue from 'vue';
import VueRouter from 'vue-router';
import PortalVue from 'portal-vue';
import Home from '../views/Home.vue';
import NavBar from '@/components/NavBar.vue';

Vue.use(PortalVue);
Vue.use(VueRouter);
Vue.component('nav-bar', NavBar);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  routes,
  linkExactActiveClass: 'active',
});

export default router;
