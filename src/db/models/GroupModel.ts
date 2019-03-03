import * as s from 'sequelize';
import { UserAttributes } from './UserModel';
import { validate, Length } from "class-validator";
import { throwError } from '../../services/errorFunction';
import { acl } from '../acl';

export class GroupAttributes {
    id?: number;
    @Length(2, 20)
    name?: string;
    @Length(2, 40)
    methods?: string;
    users?: UserAttributes[] | number[];
    createdAt?: Date;
    updatedAt?: Date;

}
export type GroupInstance = s.Instance<GroupAttributes> & GroupAttributes;

export default (
    sequelize: s.Sequelize
): s.Model<GroupInstance, GroupAttributes> => {
    const Group = sequelize.define<GroupInstance, GroupAttributes>(
        'Groupe',
        {
            id: {
                type: sequelize.Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            name: { type: sequelize.Sequelize.STRING, validate: { len: [2, 20], notEmpty: true } },
            methods: { type: sequelize.Sequelize.STRING, validate: { len: [2, 20], notEmpty: true } },
        },
        {
            validate: {
                validateGroup() {
                    let group = new GroupAttributes();
                    validate(group).then(errors => {
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
        }
    );

    Group.associate = models => {
        Group.belongsToMany(models.User, {
            through: 'UserGroups',
            as: 'users',
            foreignKey: 'groupId'
        });
    };

    Group.hook('afterUpdate', (data: any) => {
        acl.sync().then(() => {
            console.log('ACL Role Synched');
        });
    });
    return Group;
};
