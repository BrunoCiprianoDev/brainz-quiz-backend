import { AuthRoutesMiddlewares } from "@src/domain/interfaces/middlewares/authRoutesMiddlewares";
import { TokenGenerator } from "../ports/tokenGenerator";

export function authMiddlewareFactory(): AuthRoutesMiddlewares {
  const tokenGenerator = new TokenGenerator();
  return new AuthRoutesMiddlewares(tokenGenerator);
}