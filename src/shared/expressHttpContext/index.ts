import { Request, Response } from 'express';
import { IHttpContext, IRequest, IResponse } from '../../domain/util/adapters/httpContext';

export class ExpressHttpContext implements IHttpContext {
  constructor(
    private request: Request,
    private response: Response,
  ) {}

  getRequest(): IRequest {
    return {
      headers: this.request.headers,
      body: this.request.body,
      params: this.request.params ?? null,
      query: this.request.query ?? null,
    };
  }

  send(response: IResponse): void {
    this.response.status(response.statusCode).json(response.body);
  }
}
