import express, { Request, Response, Router } from 'express';
import { UserController } from '../controllers/UserController';

class UserRouter {
  public router: Router;

  constructor(loggerController: UserController) {
    this.router = express.Router();

    this.router.route('/register').post(async (req:Request, res:Response) => {
        await loggerController.register(req, res);
    })
  }
}

export { UserRouter };
