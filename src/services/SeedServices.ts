import { UserService } from '../services/userService';
import { UserAttributes } from '../db/models/UserModel';
import { GroupService } from '../services/groupService';
import { GroupAttributes } from '../db/models/GroupModel';

import { db } from '../db';
import { Transaction } from 'sequelize';

export class SeedService {

    populateDBWithData(): Promise<any> {
        console.log('populateDBWithData::');

        const promise = new Promise<any>((resolve: Function, reject: Function) => {
            db.sequelize.transaction(async (t: Transaction) => {
                const lastUser = await this.seed();
                console.log('lastUser::', lastUser);

                resolve(lastUser);
            })
                .catch((error: Error) => {
                    reject(error);
                });
        });
        return promise;
    }
    async seed() {
        const userOne: UserAttributes = {
            firstName: 'Tudor',
            lastName: 'Bostan',
            email: 'bostan.t@inbox.ru',
            password: 'sven123'
        };
        const userModel = await UserService.createUser(userOne);

        const group: GroupAttributes = {
            name: 'Admin',
            methods: '(GET)|(POST)',
            users: [userModel.id],
        };
        const groupModel = await GroupService.createGroup(group);

        const userTwo: UserAttributes = {
            firstName: 'UserTwo',
            lastName: 'UserTWo',
            email: 'user.t@inbox.ru',
            password: 'sven1432'
        };
        const userTwoModel = await UserService.createUser(userTwo);

        await GroupService.updateGroup(groupModel.id, { users: [userTwoModel.id] });

        const groupTwo: GroupAttributes = {
            name: 'Manager',
            methods: '(GET)|(POST)',
            users: [userTwoModel.id],
        };
        await GroupService.createGroup(groupTwo);
        return { message: 'Success' }
    }
}
export const seedService = new SeedService();