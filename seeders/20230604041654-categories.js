'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categori = [
      {
        name: 'Youth And Development',
        desc: 'Category Youth And Development'
      },
      {
        name: 'Carrier Development',
        desc: 'Development Carrier Category'
      },
      {
        name: 'Street Food',
        desc: 'delicious street food'
      },
      {
        name: 'Perguruan Tinggi',
        desc: 'Category yang ditujukan untuk perguruan tinggi'
      }
    ];

    categori.forEach(categories => {
      categories.createdAt = new Date();
      categories.updatedAt = new Date();
    });

    await queryInterface.bulkInsert('categories', categori, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});

  }
};
