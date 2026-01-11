'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        email: 'admin@gmail.com',
        password: '$2b$10$IGcY6Y3tWwTsePVeyYseKeLQQpXNbDKv1w5njpyU0CmRRkVphivIu', // admin123
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'user1',
        email: 'user1@example.com',
        password: '$2b$10$examplehashedpassword',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};