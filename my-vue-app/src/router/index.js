import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/LoginView.vue";
import Dashboard from "../views/DashboardView.vue";
import Flight from "../views/FlightView.vue";
import FlightClasses from "../views/FlightClassesView.vue";
import FlightSeats from "../views/FlightSeatsView.vue";
import Orders from "../views/OrdersView.vue";
import Users from "../views/UsersView.vue";
import Payments from "../views/PaymentsView.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/dashboard", component: Dashboard },
  { path: "/flight", component: Flight },
  { path: "/flight-classes", component: FlightClasses },
  { path: "/flight-seats", component: FlightSeats },
  { path: "/orders", component: Orders },
  { path: "/users", component: Users },
  { path: "/payments", component: Payments },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
