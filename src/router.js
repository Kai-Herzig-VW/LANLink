import { createRouter, createWebHistory } from 'vue-router';

import AdminPanel from './components/AdminPanel.vue';
import Status from './components/Status.vue';
import Timetable from './components/Timetable.vue';
import Gamelist from './components/Gamelist.vue';
import IchHabBock from './components/IchHabBock.vue';
import ApprovalRequired from './components/ApprovalRequired.vue';
import Impressum from './components/Impressum.vue';
import PrivacyPolicy from './components/PrivacyPolicy.vue';

const routes = [
  { path: '/', name: 'Home', component: Status },
  { path: '/games', name: 'Games', component: Gamelist },
  { path: '/bock', name: 'IchHabBock', component: IchHabBock },
  { path: '/admin', name: 'Admin', component: AdminPanel },
  { path: '/timetable', name: 'Timetable', component: Timetable },
  { path: '/approval-required', name: 'ApprovalRequired', component: ApprovalRequired },
  { path: '/impressum', name: 'Impressum', component: Impressum },
  { path: '/privacy', name: 'PrivacyPolicy', component: PrivacyPolicy },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
