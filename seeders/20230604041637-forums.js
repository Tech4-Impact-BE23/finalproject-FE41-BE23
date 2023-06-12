'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const forum = [
      {
        name: 'Pendidikan', 
        desc: 'Forum Pendidikan'
      },
      {
        name: 'Bussiness',
        desc: 'Forum Business'
      },
      {
        name: 'Kuliner',
        desc: 'Forum Masakan Enak'
      },
      {
        name: 'Remaja',
        desc: 'Forum Remaja'
      }
    ];

    forum.forEach(forum => {
      forum.createdAt = new Date();
      forum.updatedAt = new Date();
    });
    
    await queryInterface.bulkInsert('forums', forum, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('forums', null, {})
  }
};
