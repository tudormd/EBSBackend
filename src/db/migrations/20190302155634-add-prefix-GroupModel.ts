import { QueryInterface, SequelizeStatic } from 'sequelize';

export = {
  up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return Promise.all([
      queryInterface.addColumn('Groupes', 'prefix', {
        type: Sequelize.STRING,
        validate:{isUppercase: true, len: [5,30],   notEmpty: true, }
      })
    ]);
  },

  down: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
      return Promise.all([
        queryInterface.removeColumn('Groupes', 'prefix')
      ]);
  }
};
