import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt, { SignCallback } from 'jsonwebtoken';

import { UserService } from '../services/UserService';
import {
  CreateUserInput,
  RegisterUserBody,
  UpdateUserBody,
} from '../types/UserService';
import { config } from '../utils/config';

class UserController {
  service: UserService;

  constructor(service: UserService) {
    this.service = service;
  }

  generateToken(
    userId: string,
    username: string,
    isAdmin: boolean,
    cb: SignCallback
  ) {
    const payload = {
      id: userId,
      username: username,
      iat: Math.floor(Date.now() / 1000),
      isAdmin: isAdmin,
    };
    jwt.sign(payload, config.JWT_SECRET, { expiresIn: '72h' }, cb);
  }

  async register(req: Request, res: Response) {
    console.log(config.SALT_ROUNDS)
    const body = req.body as Partial<RegisterUserBody>;
    if (!body.username || !body.password || !body.confirmPassword) {
      res.status(400).send({ message: 'Bad request' });
      return;
    }

    const username = body.username.trim();
    const password = body.password.trim();
    const confirmPassword = body.confirmPassword.trim();

    if (password.length < 8) {
      res.status(400).send({ message: 'Password too short' });
    } else if (password !== confirmPassword) {
      res.status(400).send({ message: 'Different password' });
    } else {
      try {
        console.log("Test")

        const users = await this.service.findByUsername(username);

        console.log("Test2")

        if (users.length > 0) {
          console.log(users)
          res.status(400).send({ message: 'Username already used' });
          return;
        }

        console.log("find ok")

        bcrypt.hash(password, config.SALT_ROUNDS, async (err, hash) => {
          if (err) {
            console.log(err)
            res.sendStatus(500);
            return;
          }

          const addingUser: CreateUserInput = {
            username: username,
            password: hash,
            registration_date: new Date(),
            isAdmin: false,
          };

          const addedUser = await this.service.create(addingUser);

          this.generateToken(
            addedUser.id,
            addedUser.username,
            addedUser.isAdmin,
            (err: Error | null, token?: string) => {
              if (err || !token) {
                res.sendStatus(500);
                return;
              }

              res.json({
                token: token,
                user: {
                  id: addedUser.id,
                  username: addedUser.username,
                  isAdmin: addedUser.isAdmin,
                },
              });
            }
          );
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: err });
        return;
      }
    }
  }

  async login(req: Request, res: Response) {
    const body = req.body as Partial<RegisterUserBody>;
    if (!body.username || !body.password) {
      res.status(400).send({ message: 'Bad request' });
      return;
    }

    const username = body.username.trim();
    const password = body.password.trim();
    try {
      const users = await this.service.findByUsername(username);

      if (users.length === 0) {
        res.status(400).send({ message: "User doesn't exist" });
        return;
      } else if (users.length > 1) {
        res.status(500).send({ message: 'Multiple users with same username' });
        return;
      }

      const user = users[0];

      bcrypt.compare(password, user.password, (err, match) => {
        if (err) {
          res.sendStatus(500);
          return;
        }

        if (!match) {
          res.sendStatus(401);
          return;
        }

        this.generateToken(
          user.id,
          user.username,
          user.isAdmin,
          (err, token) => {
            if (err) {
              res.sendStatus(500);
              return;
            }

            res.json({
              token: token,
              user: {
                id: user.isAdmin,
                username: user.username,
                isAdmin: user.isAdmin,
              },
            });
          }
        );
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err });
      return;
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const id: string = req.params.id as string;
      const user = await this.service.getById(id);
      if (!user) {
        res.sendStatus(404);
        return;
      }
      res.json(user);
    } catch {
      res.sendStatus(500);
      return;
    }
  }

  async rename(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const body = req.body as UpdateUserBody;
      if (!id || !body.username || !body.password) {
        res.sendStatus(400);
        return;
      }

      const username = body.username.trim();
      const password = body.username.trim();

      const userExisted = await this.service.getById(id);
      if (!userExisted) {
        res.sendStatus(404);
        return;
      }

      bcrypt.compare(password, userExisted.password, async (err, match) => {
        if (err) {
          res.sendStatus(500);
          return;
        }

        if (!match) {
          res.sendStatus(401);
          return;
        }

        const userEdited = await this.service.update(id, {
          username: username,
        });
        res.json(userEdited);
      });
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const body = req.body as UpdateUserBody;
      if (!id || !body.password || !body.newPassword || !body.confirmPassword) {
        res.sendStatus(400);
        return;
      }

      const userExisted = await this.service.getById(id);
      if (!userExisted) {
        res.sendStatus(404);
        return;
      }

      const password = body.password.trim();
      const newPassword = body.newPassword.trim();
      const confirmPassword = body.confirmPassword.trim();

      bcrypt.compare(password, userExisted.password, (err, match) => {
        if (err) {
          res.sendStatus(500);
          return;
        }

        if (!match) {
          res.sendStatus(401);
          return;
        }

        if (newPassword.length < 8 || newPassword !== confirmPassword) {
          res.sendStatus(400);
          return;
        }

        bcrypt.hash(newPassword, config.SALT_ROUNDS, async (err, hash) => {
          if (err) {
            res.sendStatus(500);
            return;
          }

          await this.service.update(id, { password: hash });
          res.sendStatus(200);
        });
      });
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
  }

  async delete(req: Request, res: Response) {
    const id: string = req.params.id as string;
    if (!id) {
      return res.status(400).json({ error: 'Missing user id' });
    }
    await this.service.delete(id);
    res.status(204).send();
  }
}

export { UserController };
