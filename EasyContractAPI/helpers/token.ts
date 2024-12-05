// web token dependency
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
//use env variable
const key = process.env.KEY;

function verifyToken(req,res,next){
    //check if authorization exists
    
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request');
    }else{
        //split where there is a space and take token
        //@ index 1
        let token = req.headers.authorization.split(' ')[1]; 
        //check if token is null
        if(token === null){
            return res.status(401).send('Unauthorized request');
        } else{
            let payload = jwt.verify(token, key);
            //checks if valid token
            if(!payload){
                return res.status(401).send('Unauthorized request');
            }
            req.body.user_id = payload.subject;
            next();
        }
    }
}

export default verifyToken;