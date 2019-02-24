import * as s from 'sequelize';
import { UserAttributes } from './UserModel';

export interface GroupAttributes {
    id?: number;
    name: string;
    methods: string;
    users: UserAttributes[];
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
            name: sequelize.Sequelize.STRING,
            methods: sequelize.Sequelize.STRING,
        },
        {
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
        //   acl.sync().then(() => {
        //   console.log('ACL Role Synched');
        // });
    });
    return Group;
};
