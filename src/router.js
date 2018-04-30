import controller from './views/controls.vue';
import game from './views/games.vue';

export default [
  {
    path: '/',
    component: controller
  },
  {
    path: '/game',
    component: game
  }
]