// web token dependency
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';



function verifyToken(req: Request, res: Response, next: any) {
    //use env variable
    const key = process.env.KEY;
    //check if secret key exists
    if(!key){
        res.status(401).send('Unauthorized request, Internal Server Error');
        return;
    }
    //check if authorization headers exist
    if (!req.headers.authorization) {
        res.status(401).send('Unauthorized request');
        return;
    } else {
        //split where there is a space and take token
        //@ index 1
        let token = req.headers.authorization.split(' ')[1];
        //check if token is null
        if (token === null) {
            res.status(401).send('Unauthorized request');
            return;
        } else {
            let payload: any = jwt.verify(token,key);
            //checks if valid token
            if (!payload) {
                res.status(401).send('Unauthorized request');
                return;
            }
            req.body.userId = payload.id;
            req.body.companyId = payload.companyId;
            next();
        }
    }
}

export default verifyToken;
