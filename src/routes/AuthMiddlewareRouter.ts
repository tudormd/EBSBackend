import { Request, Response, Router } from 'express';
import { throwError, sendError, sendSuccess } from '../services/errorFunction';
import jwt from 'jsonwebtoken';

export const routes = Router();

routes.use('/', async (req: Request, res: Response, next) => {
    try {
        const token = await req.query.token || req.headers['x-access-token'];
        jwt.verify(token, req.app.get('superSecret'), (err: Error, decoded: any) => {
            if (err) {
                throwError(404, 'Failed to authenticate token', 'incorrect request')('')
            } else {
                console.log('path, session',decoded); 

                req.session = decoded;
                req.params.userId = decoded.id;

                next();
            }
        })

    } catch (error) {
        sendError(res)(error)
    }

});
