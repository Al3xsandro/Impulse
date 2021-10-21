import { Router } from "express";
import { ensureAuthenticated } from "../../../modules/users/middlewares/ensureAuthenticated.middleware";

import { CreateMessageController } from "../../../modules/messages/useCases/CreateMessage/CreateMessage.controller";
import { GetLast3MessagesController } from "../../../modules/messages/useCases/GetLast3Messages/GetLast3Messages.controller";

const createMessageController = new CreateMessageController();
const getLast3MessagesController = new GetLast3MessagesController();

const route = Router();

route.post('/messages', ensureAuthenticated, createMessageController.handle);
route.get('/messages/last3', getLast3MessagesController.handle);

export default route;