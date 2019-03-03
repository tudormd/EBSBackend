import { UserAttributes, UserInstance } from '../db/models/UserModel';
import { Transaction } from 'sequelize';
import { db } from '../db';

export class UserService {

    static createUser(
        qMSUserAttributes: UserAttributes,
    ): Promise<UserInstance> {
        const promise = new Promise<UserInstance>(
            (resolve: Function, reject: Function) => {
                db.sequelize.transaction((t: Transaction) => {
                    return db.models.User.create(qMSUserAttributes, {
                        individualHooks: true
                    })
                        .then((user: UserInstance) => {
                            resolve(user);
                        })
                        .catch((error: Error) => {
                            reject(error);
                        });
                });
            }
        );

        return promise;
    }

    static retrieveUser(id: number): Promise<UserInstance> {
        const promise = new Promise<UserInstance>(
            (resolve: Function, reject: Function) => {
                return db.models.User.findOne({
                    where: { id: id }
                })
                    .then((user: UserInstance) => {
                        resolve(user);
                    })
                    .catch((error: Error) => {
                        reject(error);
                    });
            }
        );
        return promise;
    }
    static retrieveUserByEmail(email: string): Promise<UserInstance> {
        const promise = new Promise<UserInstance>(
            (resolve: Function, reject: Function) => {
                return db.models.User.findOne({
                    where: { email: email }
                })
                    .then((user: UserInstance) => {
                        resolve(user);
                    })
                    .catch((error: Error) => {
                        reject(error);
                    });
            }
        );
        return promise;
    }

    static retrieveUsers(): Promise<UserInstance[]> {
        const promise = new Promise<UserInstance[]>(
            (resolve: Function, reject: Function) => {
                db.sequelize.transaction((t: Transaction) => {
                    return db.models.User.findAll()
                        .then((user: UserInstance[]) => {
                            resolve(user);
                        })
                        .catch((error: Error) => {
                            reject(error);
                        });
                });
            }
        );

        return promise;
    }

    static updateUser(
        id: number,
        qMSUserAttributes: UserAttributes,
    ): Promise<UserAttributes> {
        const promise = new Promise<UserAttributes>(
            (resolve: Function, reject: Function) => {
                db.sequelize.transaction((t: Transaction) => {
                    return db.models.User.findById(id)
                        .then((result: UserAttributes) => {
                            // @ts-ignore
                            result.update(qMSUserAttributes);
                            resolve(result);
                        })
                        .catch((error: Error) => {
                            reject(error);
                        });
                });
            }
        );

        return promise;
    }

    static deleteUser(id: number): Promise<number> {
        const promise = new Promise<number>(
            (resolve: Function, reject: Function) => {
                db.sequelize.transaction((t: Transaction) => {
                    return db.models.User.destroy({ where: { id: id } })
                        .then((affectedRows: number) => {
                            resolve(affectedRows);
                        })
                        .catch((error: Error) => {
                            reject(error);
                        });
                });
            }
        );

        return promise;
    }
}
