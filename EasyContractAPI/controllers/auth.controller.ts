import { Router, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import User from '../entities/User';
import bcrypt from 'bcrypt';
import { LoginDTO } from '../models/dto/LoginDTO';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/auth.service';
export default class AuthController {
    
    constructor(private authService: AuthService) {
    }

    login = async (req: Request, res: Response) => {
        try {
            let login: LoginDTO = req.body;
            const user: User | null = await this.authService.findUserPassword(login.email);
            if (!user || !user.password) {
                res.status(401).send('User not found');
                return;
            }

            const valid: boolean = await bcrypt.compare(
                login.password,
                user.password,
            );

            if (!process.env.KEY) {
                res.status(500).send('Internal Error Logging In');
                return;
            }
            if (valid && process.env.KEY) {
                const token = jwt.sign(
                    { id: user.id, companyId: user.companyId },
                    process.env.KEY,
                    {
                        expiresIn: '1 days',
                    },
                );
                res.status(200).send({ token: token, name: user.name + " " + user.surname });
                return;
            }

            res.status(401).send();
            return;
        } catch (err) {
            res.status(500).send('Internal Error');
            return;
        }
    }

    forgot = async (req: Request, res: Response) => {
        try {
            let user: User = req.body;
            //check if email exists
            const foundUser = await this.authService.findUserPassword(user.email);
            //...

        } catch (error) {
            res.status(500).send('error creating user');
        }
    }

    otp = (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const user = req.body;

        } catch (err) {
            res.status(500).send('error updating user');
        }
    }
}
