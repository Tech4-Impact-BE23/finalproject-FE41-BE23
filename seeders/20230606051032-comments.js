'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const comments = [
      {
        content: "Dengan memberikan dorongan - dorongan positif terhadap pemuda dalam menggapai cita - cita mereka",
        postId: 1,
        userId: 3
      },
      {
        content: "Dapat dimulai dengan mempelajari bisnis yang akan di lakukan, membangun koneksi untuk membangun bisnis",
        postId: 2,
        userId: 3
      },
      {
        content: "Merasakan perkuliahan di asean dengan baik yang didukung oleh masyarakat dan teman sekampus yang baik",
        postId: 4,
        userId: 2
      }
      ,
      {
        content: "Banyak Opsional lokasi Negara makanan terenak di Asean: Indonesia, Singapore, Thailand dan yang lainya",
        postId: 3,
        userId: 4
      }
    ];

    comments.forEach(comments => {
      comments.createdAt = new Date();
      comments.updatedAt = new Date();
    });

    await queryInterface.bulkInsert('comments', comments, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comments', null, {});
  }
};
