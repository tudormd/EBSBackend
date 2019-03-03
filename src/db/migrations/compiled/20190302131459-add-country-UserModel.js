"use strict";
module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn('Users', 'country', {
                type: Sequelize.STRING,
                validate: { len: [2, 30], notEmpty: true }
            })
        ]);
    },
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn('Users', 'country')
        ]);
    }
};
