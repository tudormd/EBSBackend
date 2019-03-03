import { Request, Response, Router } from 'express';
import { throwError, sendError, sendSuccess } from '../services/errorFunction';
import { UserService } from "../services/userService"
import { UserAttributes } from 'src/db/models/UserModel';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import moment from "moment"

export const routes = Router();

routes.post('/register', async (req: Request, res: Response) => {
    try {
        const user: UserAttributes = await UserService.createUser(req.body)
        if (user) {
            const token = jwt.sign({ id: user.id }, req.app.get('superSecret'), {
                expiresIn: 24 * 60 * 60 // expires in 24 hours
            }
            );
            sendSuccess(res, 'Create token')(token);
        } else {
            throwError(404, 'Invalid registration', 'incorrect request')({ code: 404, message: 'Invalid registration' })
        }
    } catch (error) {
        sendError(res)(error)
    }
})

routes.post('/login', async (req: Request, res: Response) => {
    try {
        if (!req.body.email) throwError(404, 'not found email', 'incorrect request')({ code: 404 })

        const user = await UserService.retrieveUserByEmail(req.body.email);

        if (user) {
            const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
            if (passwordIsValid) {
                const token = jwt.sign({ id: user.id }, req.app.get('superSecret'), {
                    expiresIn: 24 * 60 * 60 // expires in 24 hours
                }
                );
                await UserService.updateUser(user.id, { lastLoginAt: moment().utc().toDate() })
                sendSuccess(res, 'Create token')(token);
            } else {
                throwError(404, 'Invalid token', 'incorrect request')({ code: 404 })
            }

        } else {
            throwError(500, 'Invalid user', 'sequelize error')({ code: 500 })
        }

    } catch (error) {
        sendError(res)(error)
    }

}) 
