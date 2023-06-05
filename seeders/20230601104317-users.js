'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const Users = [{
      name: 'Adya',
      email: 'admin1@exam.co.id',
      role: 'admin',
    },
    {
      name: 'Anry',
      email: 'ary1@exam.co.id',
      role: 'user'
    },
    {
      name: 'Amy',
      email: 'ami1@exam.co.id',
      role: 'user'
    },
    {
      name: 'Yuni',
      email: 'yuni1@exam.co.id',
      role: 'user'
    }
    ];

    const passwordUser = await bcrypt.hash('user', 10);
    const passwordAdmin = await bcrypt.hash('admin', 10);

    Users.forEach(user => {
      if (user.role === 'admin') {
        user.password = passwordAdmin;
      } else {
        user.password = passwordUser;
      }
      user.createdAt = new Date();
      user.updatedAt = new Date();
    });

    await queryInterface.bulkInsert('Users', Users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
};