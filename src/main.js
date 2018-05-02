import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import Router from './router';
import TweenMax from "gsap";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: Router
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App),
  gameWindow: null,
  usedMessageWords: null,
  usedPhotographyWords: null,
  usedElementWords: null,
  pipInterval: null,
  timerInterval: null,
  counterInterval: null,
  controlTimerInterval: null,
  gameClock: null
});


