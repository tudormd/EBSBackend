import * as s from 'sequelize';
import { GroupAttributes } from './GroupModel';
import bcrypt from 'bcrypt';

export interface UserAttributes {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    lastLoginAt?: Date;
    createdAt?: Date;
    updatedAt?: Date; 
    groups?:GroupAttributes[]
}

export type UserInstance = s.Instance<UserAttributes> & UserAttributes;

export default (sequelize: s.Sequelize): s.Model<UserInstance, UserAttributes> => {
    const User = sequelize.define<UserInstance, UserAttributes>(
        'User',
        {
            id: {
                type: sequelize.Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true, 
                primaryKey: true
            },
            firstName: sequelize.Sequelize.STRING,
            lastName: sequelize.Sequelize.STRING,
            password:sequelize.Sequelize.STRING,
            email: sequelize.Sequelize.STRING,
            lastLoginAt: sequelize.Sequelize.DATE,
        },
        {
            timestamps: true,
            // don't delete database entries but set the newly added attribute deletedAt
            // to the current date (when deletion was done). paranoid will only work if
            paranoid: true
        }
    );

    User.hook(
        'beforeCreate',
        async (user: UserAttributes) => {
            user.password = await bcrypt.hash(user.password, 10);
            return user;
        }
    );

    return User;
};
