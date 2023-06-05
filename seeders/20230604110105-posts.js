'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const posts = [
      {
        title: "Pentingnya pendidikan untuk Remaja",
        content: "Bagaimana memberikan pendidikan remaja yang sesuai di era industri 5.0",
        forumsId: 4,
        categoriesId: 1,
        userId: 2
      },
      {
        title: "Pengembangan Bisnis",
        content: "Apa saja kiat - Kiat Mengembangankan Bisnis Skala Kecil",
        forumsId: 2,
        categoriesId: 2,
        userId: 2
      },
      {
        title: "Lokasi Makanan Terenak Asean",
        content: "Mana saja Lokasi Rekomendasi Makanan Terenak Ketika Berwisata di Thailand",
        forumsId: 3,
        categoriesId: 3,
        userId: 3
      },
      {
        title: "Pengembangan Bisnis",
        content: "Cara untuk Merintis Bisnis di Negara Asean",
        forumsId: 2,
        categoriesId: 2,
        userId: 3
      },
      {
        title: "Pengalaman Kuliah Di Negara Asean",
        content: "Bagaimana rasa dan pengalaman ketika melakukan kegiatan pembelajaran di universitas yang ada pada Asean",
        forumsId: 1,
        categoriesId: 4,
        userId: 4
      }
    ];

    posts.forEach(posts => {
      posts.createdAt = new Date();
      posts.updatedAt = new Date();
    });

    await queryInterface.bulkInsert('posts', posts, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('posts', null, {});
  }
};
