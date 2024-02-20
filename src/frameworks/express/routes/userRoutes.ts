import { Router, Request, Response } from 'express';
import { ExpressHttpContext } from '../ports/expressHttpContext';
import { userFactory } from '../factories/userFactory';

export const userRoutes = Router();

userRoutes.post('/', (request: Request, response: Response) => {
  userFactory().createPlayer(new ExpressHttpContext(request, response));
});

userRoutes.post('/admin', (request: Request, response: Response) => {
  userFactory().createAdmin(new ExpressHttpContext(request, response));
});

userRoutes.get('/findById/:id', (request: Request, response: Response) => {
  userFactory().findById(new ExpressHttpContext(request, response));
});

userRoutes.get('/findAll', (request: Request, response: Response) => {
  userFactory().findAll(new ExpressHttpContext(request, response));
});

userRoutes.patch('/role', (request: Request, response: Response) => {
  userFactory().updateRole(new ExpressHttpContext(request, response));
});

userRoutes.patch('/updatePassword', (request: Request, response: Response) => {
  userFactory().updatePassword(new ExpressHttpContext(request, response));
});

userRoutes.get('/getTokenForgotPassword', (request: Request, response: Response) => {
  userFactory().sendTokenUpdatePasswordByEmail(new ExpressHttpContext(request, response));
});

userRoutes.post('/auth', (request: Request, response: Response) => {
  userFactory().authenticate(new ExpressHttpContext(request, response));
});
