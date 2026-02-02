import express, { Request, Response, Router } from 'express';

import { UserController } from '../controllers/UserController';
import { authenticate, requestDetails } from '../utils/auth';

class UserRouter {
  public router: Router;

  constructor(userController: UserController) {
    this.router = express.Router();

    this.router
      .route('/register')
      .post(
        requestDetails,
        authenticate,
        async (req: Request, res: Response) => {
          await userController.register(req, res);
        }
      );

    this.router
      .route('/login')
      .post(
        requestDetails,
        authenticate,
        async (req: Request, res: Response) => {
          await userController.login(req, res);
        }
      );

    this.router
      .route('/:id')
      .post(authenticate, async (req: Request, res: Response) => {
        await userController.findOne(req, res);
      })
      .delete(authenticate, async (req: Request, res: Response) => {
        await userController.delete(req, res);
      });

    this.router
      .route('/:id/rename')
      .patch(authenticate, async (req: Request, res: Response) => {
        await userController.rename(req, res);
      });

    this.router
      .route('/:id/password')
      .patch(authenticate, async (req: Request, res: Response) => {
        await userController.changePassword(req, res);
      });
  }
}

export { UserRouter };
