export default [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("@/views/Search"),
  },
  {
    path: "/chat",
    name: "chat",
    component: () => import("@/views/Chat"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound404",
    component: () => import("@/views/NotFound404"),
  },
]