
const routes = [
  {
    path: '/',
    meta: {requiresAuth: false},
    component: () => import('layouts/GuestLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/Auth.vue') },
    ]
  },

  {
    path: '/home',
    meta: {requiresAuth: true},
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/home', component: () => import('pages/Home.vue'), meta: {requiresAuth: true} }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
