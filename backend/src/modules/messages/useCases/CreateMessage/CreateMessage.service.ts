import prismaClient from "../../../../infra/prisma";
import { io } from '../../../../infra/http/app';

import { CreateMessageDTO } from "../../dtos/CreateMessage.dto";

import { AppError } from "../../../../infra/errors/AppError";

class CreateMessageService {
    async execute(createMessage: CreateMessageDTO) {
        const { text, user_id } = createMessage;

        const message = await prismaClient.message.create({
            data: {
                text,
                user_id
            },
            include: {
                user: true
            }
        });

        if (!message)
            throw new AppError('Bad Request', 400);

        const infoWS = {
            id: message.id,
            text: message.text,
            user_id: message.user_id,
            created_at: message.created_at,
            user: {
                name: message.user.name,
                avatar_url: message.user.avatar_url
            }
        }

        io.emit('new_message', infoWS);

        return message;
    }
};

export { CreateMessageService };