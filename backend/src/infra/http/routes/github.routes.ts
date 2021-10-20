import { Router } from "express";
import { AppError } from "../../errors/AppError";

const route = Router();

route.get('/github', (request, response) => {
    console.log('github')
    response.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
});

route.get('/signin/callback', (request, response) => {
    const { code } = request.query;

    if (!code)
        throw new AppError('bad request');

    response.json({
        code
    })
});

export default route;