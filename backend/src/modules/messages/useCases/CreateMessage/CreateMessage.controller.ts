import { Request, Response } from "express";
import { AppError } from "../../../../infra/errors/AppError";

import { CreateMessageService } from "./CreateMessage.service";

class CreateMessageController {
    async handle(request: Request, response: Response) {
        const { message } = request.body;
        const { user_id } = request;

        if (!message.trim())
            throw new AppError('Bad Request');

        const createMessageService = new CreateMessageService();

        const result = await createMessageService.execute({ text: message, user_id });

        return response.json(result);
    };
};

export { CreateMessageController };