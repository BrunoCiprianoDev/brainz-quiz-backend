import { Router } from 'express';
import { userRoutes } from './userRoutes';
import { profileRoutes } from './profileRoutes';
import { subjectRoutes } from './subjectRoutes';
import { levelRoutes } from './levelRoutes';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/profiles', profileRoutes);
routes.use('/subjects', subjectRoutes);
routes.use('/levels', levelRoutes);

export default routes;
