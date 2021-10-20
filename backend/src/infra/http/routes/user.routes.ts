import { Router } from "express";
import { ensureAuthenticated } from "../../../modules/users/middlewares/ensureAuthenticated.middleware";

import { ProfileUserController } from "../../../modules/users/useCases/Profile/ProfileUser.controller";

const profileUserController = new ProfileUserController();

const route = Router();

route.get('/profile', ensureAuthenticated, profileUserController.handle);

export default route;