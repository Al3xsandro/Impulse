import { Request, Response } from 'express';
import { AppError } from '../../../../infra/errors/AppError';

import { AuthenticateUserService } from './AuthenticateUser.service';

interface IReq {
    code: string;
}

class AuthenticateUserController {
    async handle(request: Request, response: Response) {
        const { code }: IReq = request.body;

        if(!code)
            throw new AppError('Bad request');

        const authenticateUserService = new AuthenticateUserService();
        
        const auth = await authenticateUserService.execute(code);

        return response.json(auth)
    };
};

export { AuthenticateUserController };