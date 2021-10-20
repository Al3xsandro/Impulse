import { Router } from "express";

import { AuthenticateUserController } from "../../../modules/users/useCases/Authentication/AuthenticateUser.controller";

const route = Router();

const authenticateUserController = new AuthenticateUserController();

route.post('/authenticate', authenticateUserController.handle)

export default route;