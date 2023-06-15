'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const reaction = [
      {
        type: "Like",
        commentId: 1,
        userId: 3
      },
      {
        type: "Dislike",
        commentId: 4,
        userId: 2
      },
      {
        type: "Like",
        commentId: 1,
        userId: 4
      },
      {
        type: "Like",
        commentId: 3,
        userId: 2
      },
      {
        type: "Dislike",
        commentId: 2,
        userId: 4
      },
    ];

    reaction.forEach(reactions => {
      reactions.createdAt = new Date();
      reactions.updatedAt = new Date();
    });

    await queryInterface.bulkInsert('commentsReactions', reaction, {});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('commentsReactions', null, {});
  }
};
