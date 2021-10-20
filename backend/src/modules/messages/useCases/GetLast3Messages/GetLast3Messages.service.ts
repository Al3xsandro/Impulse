import prismaClient from "../../../../infra/prisma";
import { AppError } from "../../../../infra/errors/AppError";

class GetLast3MessageService {
    async execute() {
        const messages = await prismaClient.message.findMany({
            take: 3,
            orderBy: {
                created_at: 'desc'
            },
            include: {
                user: true
            }
        });

        if (!messages)
            throw new AppError('Bad Request');

        return messages;
    }
};

export { GetLast3MessageService };