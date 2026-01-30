import express, { Request, Response, Router } from 'express';

import { UserController } from '../controllers/UserController';
import { requestDetails } from '../utils/auth';

class UserRouter {
  public router: Router;

  constructor(userController: UserController) {
    this.router = express.Router();

    this.router
      .route('/register')
      .post(requestDetails, async (req: Request, res: Response) => {
        await userController.register(req, res);
      });

    this.router
      .route('/login')
      .post(requestDetails, async (req: Request, res: Response) => {
        await userController.login(req, res);
      });
  }
}

export { UserRouter };
