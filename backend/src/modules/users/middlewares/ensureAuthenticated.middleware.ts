import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../infra/errors/AppError";

import { verify } from "jsonwebtoken";

interface IPayload {
    sub: string;
}

export function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authToken = request.headers.authorization;

    if (!authToken)
        throw new AppError('Token invalid', 401)

    const [, token] = authToken.split(' ');

    try {
        const { sub } = verify(token, process.env.SECRET_JWT) as IPayload;
        request.user_id = sub;

        return next();
    } catch (err) {
        throw new AppError('Expired token', 401);
    };
};