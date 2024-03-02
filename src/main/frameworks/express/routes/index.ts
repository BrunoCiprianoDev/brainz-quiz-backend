import { Router } from 'express';
import { userRoutes } from './userRoutes';
import { profileRoutes } from './profileRoutes';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/profiles', profileRoutes);

export default routes;
