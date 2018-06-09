import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import ProfileView from "./views/ProfileView.vue";
import HistoryView from "./views/HistoryView.vue";
import ExercisesView from "./views/ExercisesView.vue";
import ExerciseShowView from "./views/ExerciseShowView.vue";
import RoutinesView from "./views/RoutinesView.vue";
import MeasureView from "./views/MeasureView.vue";
import UserRegistrationView from "./views/UserRegistrationView.vue";
import UserLoginView from "./views/UserLoginView.vue";
import Session from "@/services/Session";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      // redirect: "/profile"
      redirect: "/history"
    },
    {
      path: "/profile",
      name: "ProfileView",
      component: ProfileView
    },
    {
      path: "/history",
      name: "HistoryView",
      component: HistoryView
    },
    {
      path: "/exercises",
      name: "ExercisesView",
      component: ExercisesView
    },
    {
      path: "/exercises/:id",
      name: "ExerciseShowView",
      // props: route => ({ id: parseInt(route.params.id) }),
      props: route => ({ id: route.params.id }),
      // props: true,
      component: ExerciseShowView
    },
    {
      path: "/routines",
      name: "RoutinesView",
      component: RoutinesView
    },
    {
      path: "/measure",
      name: "MeasureView",
      component: MeasureView
    },
    {
      path: "/users/new",
      name: "UserRegistrationView",
      component: UserRegistrationView,
      meta: {
        bypassAuth: true,
        redirectIfAuthenticated: true
      }
    },
    {
      path: "/sessions/new",
      name: "UserLoginView",
      component: UserLoginView,
      meta: {
        bypassAuth: true,
        redirectIfAuthenticated: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.bypassAuth) {
    if (to.meta.redirectIfAuthenticated && Session.currentUser()) {
      next("/");
    } else {
      next();
    }
  } else if (Session.currentUser()) {
    next();
  } else {
    next({ name: "UserLoginView" });
  }
});

export default router;
