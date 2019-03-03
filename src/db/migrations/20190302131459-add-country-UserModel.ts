import { QueryInterface, SequelizeStatic } from 'sequelize';

export = {
  up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return Promise.all([
      queryInterface.addColumn('Users', 'country', {
        type: Sequelize.STRING,
        validate:{ len: [2,30],   notEmpty: true, }
      })
    ]);
  },

  down: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'country')
    ]);
  }
};
