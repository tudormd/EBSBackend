import { Request, Response, Router } from 'express';
import { throwError, sendError, sendSuccess } from '../services/errorFunction';
import { GroupService } from "../services/groupService"
import { GroupAttributes } from '../db/models/GroupModel';

export const routes = Router();

routes.post('/', async (req: Request, res: Response) => {
    try {
        const group: GroupAttributes = await GroupService.createGroup(req.body)
        if (group) {
            sendSuccess(res, 'Create group')(group)
        } else {
            throwError(404, 'not create group', 'incorrect request')({})
        }
    } catch (error) {
        sendError(res)(error)
    }
})

routes.get('/:id', async (req: Request, res: Response) => {
    try {
        const group: GroupAttributes = await GroupService.retrieveGroup(req.params.id);
        if (group) {
            sendSuccess(res, 'Retrieve group')(group)
        } else {
            throwError(404, 'not found group', 'incorrect request')({ code: 404 })
        }
    } catch (error) {
        sendError(res)(error)
    }
});


routes.get('/', async (req: Request, res: Response) => {
    try {
        const groups: GroupAttributes[] = await GroupService.retrieveGroups();
        if (groups.length) {
            sendSuccess(res, 'Retrieve groups')(groups)
        } else {
            throwError(404, 'not found groups', 'incorrect request')({ code: 404 })
        }
    } catch (error) {
        sendError(res)(error)
    }
});
routes.get('/group/:groupId', async (req: Request, res: Response) => {
    try {
        const group: GroupAttributes = await GroupService.retrieveUserByGroup(req.params.groupId);
        if (group) {
            sendSuccess(res, 'Retrieve group')(group)
        } else {
            throwError(404, 'not found group', 'incorrect request')({ code: 404 })
        }
    } catch (error) {
        sendError(res)(error)
    }
});


routes.put('/:id', async (req: Request, res: Response) => {
    try {
        const group: GroupAttributes = await GroupService.updateGroup(req.params.id, req.body);
        if (group) {
            sendSuccess(res, 'Update group')(group)
        } else {
            throwError(404, 'not update  group', 'incorrect request')({ code: 404 })
        }
    } catch (error) {
        sendError(res)(error)
    }
});

routes.delete('/:id', async (req: Request, res: Response) => {
    try {
        const group = await GroupService.deleteGroup(req.params.id);
        if (group > 0) {
            sendSuccess(res, 'Delete group')(group)
        } else {
            throwError(404, 'not delete  group', 'incorrect request')({ code: 404 })
        }
    } catch (error) {
        sendError(res)(error)
    }
}); 