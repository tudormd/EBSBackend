import { Request, Response, Router } from 'express';
import { throwError, sendError, sendSuccess } from '../services/errorFunction';
import { UserService } from "../services/userService"
import { UserAttributes } from 'src/db/models/UserModel';

export const routes = Router();

routes.post('/', async (req: Request, res: Response) => {
    try {
        const user: UserAttributes = await UserService.createUser(req.body)
        if (user) {
            sendSuccess(res, 'Create user')(user)
        } else {
            throwError(404, 'not create user', 'incorrect request')('')
        }
    } catch (error) {
        sendError(res)(error)
    }
})

routes.get('/:id', async (req: Request, res: Response) => {
    try {
        const user: UserAttributes = await UserService.retrieveUser(req.params.id);
        if (user) {
            sendSuccess(res, 'Retrieve user')(user)
        } else {
            throwError(404, 'not found user', 'incorrect request')('')
        }
    } catch (error) {
        sendError(res)(error)
    }
});

routes.get('/', async (req: Request, res: Response) => {
    try {
        const users: UserAttributes[] = await UserService.retrieveUsers();
        if (users.length) {
            sendSuccess(res, 'Retrieve users')(users)
        } else {
            throwError(404, 'not found users', 'incorrect request')('')
        }
    } catch (error) {
        sendError(res)(error)
    }
});

routes.put('/:id', async (req: Request, res: Response) => {
    try {
        const user: UserAttributes = await UserService.updateUser(req.params.id, req.body);
        if (user) {
            sendSuccess(res, 'Update user')(user)
        } else {
            throwError(404, 'not update  users', 'incorrect request')('')
        }
    } catch (error) {
        sendError(res)(error)
    }
});

routes.delete('/:id', async (req: Request, res: Response) => {
    try {
        const user = await UserService.deleteUser(req.params.id);
        if (user > 0) {
            sendSuccess(res, 'Delete user')(user)
        } else {
            throwError(404, 'not delete  user', 'incorrect request')('')
        }
    } catch (error) {
        sendError(res)(error)
    }
}); 