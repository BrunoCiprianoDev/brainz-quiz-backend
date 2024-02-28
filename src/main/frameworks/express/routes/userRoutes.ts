import { Router } from 'express';
import { createStandardUserFactory } from '../factories/user/createStandardUserFactory';
import { Request, Response } from 'express';
import { findAllUsersFactory } from '../factories/user/findAllUsersFactory';
import { ExpressHttpContext } from '../../../../shared/expressHttpContext';
import { findByIdUsersFactory } from '../factories/user/findByIdUsersFactory';
import { updateRoleFactory } from '../factories/user/updateRoleFactory';
import { authenticateFactory } from '../factories/user/authenticateFactory';
import { authAdminMiddleware } from '../middlewares/authAdminMiddleware';
import { authStandardMiddleware } from '../middlewares/authStandardMiddleware';
import { createAdminUserFactory } from '../factories/user/createAdminUserFactory';
import { updatePasswordFactory } from '../factories/user/updatePasswordFactory';
import { getTokenUpdatePasswordFactory } from '../factories/user/getTokenUpdatePasswordFactory';

export const userRoutes = Router();

userRoutes.post('/', (request: Request, response: Response) => {
  createStandardUserFactory().execute(new ExpressHttpContext(request, response));
});
userRoutes.post('/admin', authAdminMiddleware, (request: Request, response: Response) => {
  createAdminUserFactory().execute(new ExpressHttpContext(request, response));
});
userRoutes.get('/findAll', authAdminMiddleware, (request: Request, response: Response) => {
  findAllUsersFactory().execute(new ExpressHttpContext(request, response));
});
userRoutes.get('/findById', authStandardMiddleware, (request: Request, response: Response) => {
  findByIdUsersFactory().execute(new ExpressHttpContext(request, response));
});
userRoutes.get('/password/getTokenUpdatePassword', (request: Request, response: Response) => {
  getTokenUpdatePasswordFactory().execute(new ExpressHttpContext(request, response));
});
userRoutes.patch('/password', (request: Request, response: Response) => {
  updatePasswordFactory().execute(new ExpressHttpContext(request, response));
});
userRoutes.patch('/role', authAdminMiddleware, (request: Request, response: Response) => {
  updateRoleFactory().execute(new ExpressHttpContext(request, response));
});
userRoutes.post('/auth', (request: Request, response: Response) => {
  authenticateFactory().execute(new ExpressHttpContext(request, response));
});
