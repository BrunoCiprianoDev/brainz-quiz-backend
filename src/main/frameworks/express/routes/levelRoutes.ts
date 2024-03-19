import { createLevelFactory } from "../factories/level/createLevelFactory";
import { updateLevelFactory } from "../factories/level/updateLevelFactory";
import { findLevelByIdFactory } from "../factories/level/findLevelByIdFactory";
import { findAllLevelsFactory } from "../factories/level/findAllLevelsFactory";
import { ExpressHttpContext } from "../../../../shared/expressHttpContext";
import { authAdminMiddleware } from "../middlewares/authAdminMiddleware";
import { Router, Request, Response } from 'express';
export const levelRoutes = Router();

levelRoutes.post('/', authAdminMiddleware, (request: Request, response: Response) => {
  createLevelFactory().execute(new ExpressHttpContext(request, response));
});
levelRoutes.put('/', authAdminMiddleware, (request: Request, response: Response) => {
  updateLevelFactory().execute(new ExpressHttpContext(request, response));
});
levelRoutes.get('/findById', (request: Request, response: Response) => {
  findLevelByIdFactory().execute(new ExpressHttpContext(request, response));
});
levelRoutes.get('/findAll', (request: Request, response: Response) => {
  findAllLevelsFactory().execute(new ExpressHttpContext(request, response));
});
