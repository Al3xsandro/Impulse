import { 
    Request,
    Response,
    NextFunction
} from 'express';
import { AppError } from '../../errors/AppError';

export function HandleError(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if(err instanceof AppError){
        return res.status(err.statusCode).send({
            status: err.statusCode,
            message: err.message
        });
    };

    console.error(err);

    return res.status(500).send({
        status: 500,
        message: 'Internal server error'
    });
};