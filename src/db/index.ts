import Sequelize from 'sequelize';

import User from './models/UserModel'
import Group from './models/GroupModel'

class Database {

    private sequelize: Sequelize.Sequelize;
    private db: any;
    constructor() {
        this.sequelize = new Sequelize(
            process.env.DATABASE_DB || 'postgresql_dev',
            process.env.DATABASE_USER || 'postgresql_dev',
            process.env.DATABASE_PASS || 'postgresql_dev',
            {
                host: process.env.DATABASE_HOST || '192.168.99.100',
                port: +process.env.DATABASE_PORT || 5433,
                dialect: 'postgres',
                operatorsAliases: false,
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            }
        );

        this.sequelize.authenticate().then(() => {
            console.log('Connection has been established successfully.');
        }).catch(err => {
            console.error('Unable to connect to the database:', err);
        });

        this.db = {
            sequelize: this.sequelize,
            Sequelize: Sequelize,
            models: {
                User: User(this.sequelize),
                Group: Group(this.sequelize)
            }
        };

        Object.keys(this.db.models).forEach(key => {
            console.log('foreach assiociation: ', this.db.models[key]);

            if (this.db.models[key].associate) {
                console.log('associate: ', this.db.models[key]);
                this.db.models[key].associate(this.db.models);
            }
        });
    }
    
    getDatabase() {
        return this.db;
    } 
}
const database = new Database();
export const db = database.getDatabase();
