import { Router, Request, Response } from 'express';
import { ExpressHttpContext } from '../../../../shared/expressHttpContext';
import { createSubjectFactory } from '../factories/subject/createSubjectFactory';
import { updateSubjectFactory } from '../factories/subject/updateSubjectFactory';
import { findSubjectByIdFactory } from '../factories/subject/findSubjectByIdFactory';
import { findAllSubjectsFactory } from '../factories/subject/findAllSubjectsFactory';

export const subjectRoutes = Router();

subjectRoutes.post('/', (request: Request, response: Response) => {
  createSubjectFactory().execute(new ExpressHttpContext(request, response));
});
subjectRoutes.put('/', (request: Request, response: Response) => {
  updateSubjectFactory().execute(new ExpressHttpContext(request, response));
});
subjectRoutes.get('/findById', (request: Request, response: Response) => {
  findSubjectByIdFactory().execute(new ExpressHttpContext(request, response));
});
subjectRoutes.get('/findAll', (request: Request, response: Response) => {
  findAllSubjectsFactory().execute(new ExpressHttpContext(request, response));
});