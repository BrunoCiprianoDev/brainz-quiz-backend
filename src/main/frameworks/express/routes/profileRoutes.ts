import { Router } from "express";
import { Request, Response } from "express";
import { createProfileFactory } from "../factories/profile/createProfileFactory";
import { ExpressHttpContext } from "../../../../shared/expressHttpContext";
import { findProfileByUserIdFactory } from "../factories/profile/findProfileByUserIdFactory";
import { addScorePointsFactory } from "../factories/profile/addScorePointsFactory";
import { updateNameProfileFactory } from "../factories/profile/updateNameProfileFactory";

export const profileRoutes = Router();

profileRoutes.post('/', (request: Request, response: Response) => {
  createProfileFactory().execute(new ExpressHttpContext(request, response));
});
profileRoutes.get('/findByUserId', (request: Request, response: Response) => {
  findProfileByUserIdFactory().execute(new ExpressHttpContext(request, response));
});
profileRoutes.patch('/addScore', (request: Request, response: Response) => {
  addScorePointsFactory().execute(new ExpressHttpContext(request, response));
});
profileRoutes.patch('/update/name', (request: Request, response: Response) => {
  updateNameProfileFactory().execute(new ExpressHttpContext(request, response));
});



