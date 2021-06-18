import express from 'express';
import calendarRoute from './calendar.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/calendar',
    route: calendarRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
