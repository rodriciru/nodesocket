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
    name: 'inicio',
    component: Home,
  },
  {
    path: '/anadir',
    name: 'anadir',
    // route level code-splitting
    // this generates a separate chunk (anadir.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "anadir" */ '../views/Anadir.vue'),
  },
  {
    path: '/opciones',
    name: 'opciones',
    // route level code-splitting
    // this generates a separate chunk (opciones.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "opciones" */ '../views/Opciones.vue'),
  },
];

const router = new VueRouter({
  routes,
  linkExactActiveClass: 'active',
});

export default router;
