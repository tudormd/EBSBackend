"use strict";
module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn('Groupes', 'prefix', {
                type: Sequelize.STRING,
                validate: { isUppercase: true, len: [5, 30], notEmpty: true }
            })
        ]);
    },
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn('Groupes', 'prefix')
        ]);
    }
};
