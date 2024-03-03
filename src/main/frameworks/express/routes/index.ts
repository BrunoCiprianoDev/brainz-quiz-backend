import { Router } from 'express';
import { userRoutes } from './userRoutes';
import { profileRoutes } from './profileRoutes';
import { subjectRoutes } from './subjectRoutes';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/profiles', profileRoutes);
routes.use('/subjects', subjectRoutes);

export default routes;
