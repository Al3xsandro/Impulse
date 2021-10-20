import prismaClient from "../../../../infra/prisma";
import { AppError } from "../../../../infra/errors/AppError";

class ProfileUserService {
    async execute(user_id: string) {
        const user = await prismaClient.user.findFirst({
            where: {
                id: user_id
            }
        });

        if (!user_id)
            throw new AppError('Bad request')

        return user;
    }
};

export { ProfileUserService };