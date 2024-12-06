import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore, useAlertStore } from '@/stores';
import { Home } from '@/views';
import accountRoutes from './account.routes';
import usersRoutes from './users.routes';
import pokemonsRoutes from './pokemons.routes';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
    { path: '/', component: Home },
    { ...accountRoutes },
    { ...usersRoutes },
    { ...pokemonsRoutes },
    // 매칭이 되지 않는 URL로 접근 시 마지막 path인 "/:pathMatch(.*)*"로 적용된다.
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
});

//router.beforeEach()를 사용하여 라우트 되기 이전에 전역 등록을 할 수 있다
// to : 이동할 url 정보가 담긴 라우터 객체
router.beforeEach(async (to) => {
  // clear alert on route change
  const alertStore = useAlertStore();
  alertStore.clear();

  // redirect to login page if not logged in and trying to access a restricted page 
  const publicPages = ['/account/login', '/account/register'];
  const authRequired = !publicPages.includes(to.path);
  const authStore = useAuthStore();

  console.log('to.path ' + to.path)
  console.log('authRequired ' + authRequired)
  console.log('!authStore.user ' + !authStore.user)
  console.log(authRequired && !authStore.user)

  if (authRequired && !authStore.user) {
    authStore.returnUrl = to.fullPath;
    return '/account/login';
  }
});