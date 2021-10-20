import 'dotenv/config';
import express from 'express';

import http from 'http';
import { Server } from 'socket.io';

import cors from 'cors';
import 'express-async-errors';

import { HandleError } from './middlewares/handleError.middleware';

import github from '../http/routes/github.routes';
import authentication from '../http/routes/auth.routes';
import messages from '../http/routes/messages.routes';
import user from '../http/routes/user.routes';

const app = express();

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
    cors: {
        origin: '*'
    }
});

io.on('connection', socket => {
    console.log(`Usuário conectado no socket ${socket.id}`);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(github);
app.use(authentication);
app.use(messages);
app.use(user);

app.use(HandleError);

export { serverHttp, io, };