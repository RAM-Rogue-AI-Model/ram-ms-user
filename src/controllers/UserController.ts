import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt, { SignCallback } from 'jsonwebtoken';

import { UserService } from '../services/UserService';
import { CreateUserInput, RegisterUserBody } from '../types/UserService';
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
        const users = await this.service.findByUsername(username);

        if (users.length > 0) {
          res.status(400).send({ message: 'Username already used' });
          return;
        }

        bcrypt.hash(password, config.SALT_ROUNDS, async (err, hash) => {
          if (err) {
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

  async getOne(req: Request, res: Response) {
    try {
      const id: string = req.params.id as string;
      const user = await this.service.getById(id);
      if (!user) {
        res.sendStatus(404);
        return;
      }
      res.json(user);
    } catch {
      {
        res.sendStatus(500);
        return;
      }
    }
  }

  async update(req: Request, res: Response) {
    const id: string = req.params.id as string;
    const body = req.body as Partial<CreateUserInput>;
    if (!id) {
      return res.status(400).json({ error: 'Missing user id' });
    }
    const userExists = await this.service.getById(id);
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!body.username || !body.password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const payload: CreateUserInput = body as CreateUserInput;
    const updatedUser = await this.service.update(id, payload);
    res.json(updatedUser);
  }

  async delete(req: Request, res: Response) {
    const id: string = req.params.id as string;
    if (!id) {
      return res.status(400).json({ error: 'Missing user id' });
    }
    await this.service.delete(id);
    res.status(204).send();
  }

  async list(req: Request, res: Response) {

  }
}

export { UserController };
