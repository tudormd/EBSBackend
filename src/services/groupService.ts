import { db } from '../db';
import { GroupAttributes, GroupInstance } from '../db/models/GroupModel';
import { Transaction } from 'sequelize';

export class GroupService {

    static createGroup(
        groupAttributes: GroupAttributes,
    ): Promise<GroupInstance> {
        const promise = new Promise<GroupInstance>(
            (resolve: Function, reject: Function) => {  
                db.sequelize.transaction((t: Transaction) => {
                    return db.models.Group.create(groupAttributes)
                        .then(async (group: GroupInstance) => {
                            groupAttributes.users &&  
                                // @ts-ignore
                                (await group.setUsers(groupAttributes.users));

                                const groupByGroupId = await GroupService.retrieveGroup(
                                    group.id,
                                );
                            resolve(groupByGroupId);
                        })
                        .catch((error: Error) => {
                            reject(error);
                        });
                });
            }
        );

        return promise;
    }

    static retrieveGroup(
        id: number,
    ): Promise<GroupInstance> {
        const promise = new Promise<GroupInstance>(
            (resolve: Function, reject: Function) => {
                return db.models.Group.findOne({
                    where: { id: id },
                    include:[{association:'users'}]
                })
                    .then((group: GroupInstance) => {
                        resolve(group);
                    })
                    .catch((error: Error) => {
                        reject(error);
                    });
            }
        );

        return promise;
    }

    static retrieveGroups(): Promise<GroupInstance[]> {
        const promise = new Promise<GroupInstance[]>(
            (resolve: Function, reject: Function) => {
                return db.models.Group.findAll({
                    include:[{association:'users'}]
                })
                    .then((groups: GroupInstance[]) => {
                        resolve(groups);
                    })
                    .catch((error: Error) => {
                        reject(error);
                    });
            }
        );
        return promise;
    }

    static updateGroup(
        id: number,
        groupAttributes: GroupAttributes,
    ): Promise<GroupInstance> {
        const promise = new Promise<GroupInstance>(
            (resolve: Function, reject: Function) => {
                db.sequelize.transaction((t: Transaction) => {
                    return db.models.Group.findById(id)
                        .then(async (group: GroupInstance) => {
                            // @ts-ignore
                            await group.update(groupAttributes);
                            groupAttributes.users &&
                                // @ts-ignore
                                (await group.addUsers(groupAttributes.users));

                            const resultByGroupId = await GroupService.retrieveGroup(
                                group.id
                            );
                            resolve(resultByGroupId);
                        })
                        .catch((error: Error) => {
                            reject(error);
                        });
                });
            }
        );

        return promise;
    }

    static deleteGroup(id: string): Promise<number> {
        const promise = new Promise<number>(
            (resolve: Function, reject: Function) => {
                db.sequelize.transaction((t: Transaction) => {
                    return db.models.Group.destroy({ where: { id: id } })
                        .then((affectedRows: number) => {
                            resolve(affectedRows);
                        })
                        .catch((error: Error) => {
                            db.logger.error(error.message);

                            reject(error);
                        });
                });
            }
        );

        return promise;
    }

 
    static retrieveUserByGroup(
        groupId: number,
    ): Promise<GroupAttributes> {
        const promise = new Promise<GroupInstance>(
            (resolve: Function, reject: Function) => {
                db.models.Group.findOne({
                    where: { id: groupId },
                    include: [
                        {
                            association: 'users',
                            attributes: { exclude: 'password' },
                        }
                    ]
                })
                    .then((group: GroupInstance) => {
                        resolve(group.users);
                    })
                    .catch((error: Error) => {
                        reject(error);
                    });
            }
        );

        return promise;
    }
}

