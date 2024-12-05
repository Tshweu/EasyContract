import { Router, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import User from '../models/User';
import db from '../config/db';

export default class UserController {
    constructor(){
    }
    async get(req: Request, res: Response) {
        
        try {
            // let userService = new UserService(db);
            // const body = req.body;
            // const user = await userService.findUserByEmail('test@gmail.com');
            // res.send(user);
        } catch (err) {}
    }

    async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            let userService = new UserService(db);
            const user = await userService.findUserById(id);
            res.send(user);
        } catch (err) {
            res.status(500).send('Internal Error');
        }
    }

    async create(req: Request, res: Response) {
        try {
            let user: User = req.body;
            let userService = new UserService(db);
            //check if email exists
            const foundUser = await userService.findUserByEmail(user.email);
            if(foundUser){
                res.status(401).send('User already exists');
                return;
            }
            const result: number = await userService.createUser(user);
            console.log(result);
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

    async update(req: Request, res: Response) {
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

    async delete(req: Request, res: Response) {
    }
}
