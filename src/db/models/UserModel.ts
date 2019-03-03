import * as s from 'sequelize';
import { GroupAttributes } from './GroupModel';
import bcrypt from 'bcrypt';
import { validate, Length, IsEmail } from "class-validator";
import { throwError } from '../../services/errorFunction';

export class UserAttributes {
    id?: number;
    @Length(2, 20)
    firstName?: string;
    @Length(2, 20)
    lastName?: string;
    @IsEmail()
    email?: string;
    @Length(5, 20)
    password?: string;
    lastLoginAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    groups?: GroupAttributes[]
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
            firstName: { type: sequelize.Sequelize.STRING, validate: { len: [2, 20], notEmpty: true } },
            lastName: { type: sequelize.Sequelize.STRING, validate: { len: [2, 20], notEmpty: true } },
            password: { type: sequelize.Sequelize.STRING, validate: { len: [5, 20], notEmpty: true } },
            email: { type: sequelize.Sequelize.STRING, validate: { isEmail: true, notEmpty: true }, unique: true },
            lastLoginAt: { type: sequelize.Sequelize.DATE, validate: { isDate: true, notEmpty: true } }
        },
        {
            validate: {
                validateUser() {
                    let user = new UserAttributes();
                    validate(user).then(errors => {
                        if (errors.length > 0) {
                            console.log("validation failed. errors: ", errors);
                        } else {
                            console.log("validation succeed");
                        }
                    }).catch((error) => {
                        throwError(404, 'Validation error', 'incorrect request')(error)
                    });
                }
            },
            timestamps: true,
            // don't delete database entries but set the newly added attribute deletedAt
            // to the current date (when deletion was done). paranoid will only work if
            paranoid: true
        },

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
