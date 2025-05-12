import { Router, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import User from '../models/user/CreateRequest';
import db from '../config/db';

export default class UserController {
    constructor(private userService: UserService) {
    }
    get = async(req: Request, res: Response) => {

        try {
            // const body = req.body;
            // res.send(user);
        } catch (err) { }
    }

    getById = async (req: Request, res: Response) => {
        console.log("get it")
        try {
            const id = parseInt(req.params.id);
            const user = await this.userService.findUserById(id);
            res.send(user);
        } catch (err) {
            res.status(500).send('Internal Error' + err);
        }
    }

    create = async (req: Request, res: Response) => {
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
                res.status(201).send({});
                return;
            } else {
                res.status(401).send('error creating user');
                return;
            }
        } catch (error) {
            res.status(500).send('error creating user');
        }
    }

    update = async (req: Request, res: Response) => {
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

    delete = async (req: Request, res: Response) => {
    }
}
