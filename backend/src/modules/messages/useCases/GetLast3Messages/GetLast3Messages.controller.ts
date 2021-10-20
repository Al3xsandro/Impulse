import { Request, Response } from "express";
import { GetLast3MessageService } from "./GetLast3Messages.service";

class GetLast3MessagesController {
    async handle(request: Request, response: Response) {

        const getLast3MessageService = new GetLast3MessageService();

        const result = await getLast3MessageService.execute();

        return response.json(result);
    };
};

export { GetLast3MessagesController };