import { Router, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import User from '../models/User';
import db from '../config/db';
import bcrypt from 'bcrypt';
import { LoginDTO } from '../models/dto/LoginDTO';
import jwt from 'jsonwebtoken';
export default class AuthController {

    constructor() {
    }

    async login(req: Request, res: Response) {
        try {
            let login: LoginDTO = req.body;

            let userService = new UserService(db);
            const user: User | null = await userService.findUserPassword(login.email);
            if (!user || !user.password) {
                res.status(401).send('User not found');
                return;
            }

            const valid: boolean = await bcrypt.compare(
                login.password,
                user.password,
            );

            if(!process.env.KEY){
                res.status(500).send('Internal Error');
                return;
            }
            if (valid && process.env.KEY) {
                const token = jwt.sign(
                    { id: user.id },
                    process.env.KEY,
                    {
                        expiresIn: '1 days',
                    },
                );
                res.status(200).send({token: token, name: user.name +" "+ user.surname});
                return;
            }

            res.status(401).send();
        } catch (err) {
            res.status(500).send('Internal Error');
        }
    }

    async forgot(req: Request, res: Response) {
        try {
            let user: User = req.body;
            let userService = new UserService(db);
            //check if email exists
            const foundUser = await userService.findUserByEmail(user.email);
            if (foundUser) {
                res.status(401).send('User already exists');
                return;
            }
            const result: number = await userService.createUser(user);
            if (result > 0) {
                res.status(201).send('New user created');
                return;
            } else {
                res.status(401).send('error creating user');
                return;
            }
        } catch (error) {
            res.status(500).send('error creating user');
        }
    }

    async otp(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const user = req.body;
            let userService = new UserService(db);
            const result: number = await userService.updateUserById(id, user);
            if (result > 0) {
                res.status(201).send('New user created');
                return;
            } else {
                res.status(500).send('error creating user');
                return;
            }
        } catch (err) {
            res.status(500).send('error updating user');
        }
    }
}
