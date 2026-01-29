import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import 'dotenv/config';
import { config } from './utils/config';
import { UserService } from './services/UserService';
import { UserController } from './controllers/UserController';
import { UserRouter } from './routes/UserRouter';

const app = express();
const port = config.PORT;

app.use(
  cors({
    origin: [config.API_GATEWAY_URL],
    credentials: true,
  })
);

const userService = new UserService();
const userController = new UserController(userService);

app.use('/users', new UserRouter(userController).router);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});
