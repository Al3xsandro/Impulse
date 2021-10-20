import axios from 'axios';
import prismaClient from '../../../../infra/prisma';

import { AppError } from '../../../../infra/errors/AppError';

import { sign } from 'jsonwebtoken';
import auth from '../../../../config/auth';

interface IAccessTokenResponse {
    access_token: string;
};

interface IUserResponse {
    avatar_url: string;
    login: string;
    id: number;
    name: string;
}

class AuthenticateUserService {
    async execute(code: string): Promise<unknown> {
        const url = "https://github.com/login/oauth/access_token";

        const { data: IAccessTokenResponse }= await axios.post<IAccessTokenResponse>(url, null, { 
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            },
            headers: {
                "Accept": "application/json"
            }
        })

        if(!IAccessTokenResponse.access_token)
            throw new AppError('Expired code', 401);

        const response = await axios.get<IUserResponse>('https://api.github.com/user', {
            headers: {
                authorization: `Bearer ${IAccessTokenResponse.access_token}`
            }
        });

        const { 
            id,
            name,
            login,
            avatar_url
         } = response.data;

        let user = await prismaClient.user.findFirst({ where: {
            github_id: id
         }});

        if(!user) {
            user = await prismaClient.user.create({
                data: {
                    github_id: id,
                    name,
                    login,
                    avatar_url
                }
            });
        };

        const token = sign(
            { 
                user: {
                    name: user.name,
                    avatar_url: user.avatar_url,
                    id: user.id
                }
            },
            auth.secret,
            {
                subject: user.id,
                expiresIn: auth.expires
            }
        );

        return {
            user,
            token
        };
    };
};

export { AuthenticateUserService };