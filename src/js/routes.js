import Caritoko from "../pages/caritoko.vue";
import HomePage from "../pages/home.vue";
import LoginPage from "../pages/login.vue";

var routes = [
  {
    path: "/",
    component: LoginPage,
  },
  {
    path: "/cariToko/",
    component: Caritoko,
  },
];

export default routes;
