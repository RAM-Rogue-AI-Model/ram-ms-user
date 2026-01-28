import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

(() => {
  dotenv.config();

  const app = express();
  const port = process.env.PORT ?? 3002;

  app.use(
    cors({
      origin: [process.env.CLIENT_URL ?? 'http://localhost:3000'],
      credentials: true,
    })
  );

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
  });

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${port}`);
  });
})();
