'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    // Seed teams

    await queryInterface.bulkInsert('Teams', [

      { name: 'Ducati Lenovo Team', country: 'Italy', createdAt: new Date(), updatedAt: new Date() },

      { name: 'Monster Energy Yamaha MotoGP', country: 'Japan', createdAt: new Date(), updatedAt: new Date() },

      { name: 'Repsol Honda Team', country: 'Japan', createdAt: new Date(), updatedAt: new Date() },

      { name: 'Aprilia Racing', country: 'Italy', createdAt: new Date(), updatedAt: new Date() },

      { name: 'Gresini Racing MotoGP', country: 'Italy', createdAt: new Date(), updatedAt: new Date() },

      { name: 'LCR Honda', country: 'Japan', createdAt: new Date(), updatedAt: new Date() },

      { name: 'Pramac Racing', country: 'Italy', createdAt: new Date(), updatedAt: new Date() },

      { name: 'Tech3 KTM Factory Racing', country: 'Austria', createdAt: new Date(), updatedAt: new Date() },

      { name: 'Red Bull KTM Factory Racing', country: 'Austria', createdAt: new Date(), updatedAt: new Date() },

      { name: 'Suzuki Ecstar', country: 'Japan', createdAt: new Date(), updatedAt: new Date() }

    ], {});

    // Seed riders

    await queryInterface.bulkInsert('Riders', [

      { name: 'Francesco Bagnaia', teamId: 1, nationality: 'Italy', birthdate: '1997-01-14', createdAt: new Date(), updatedAt: new Date() },

      { name: 'Enea Bastianini', teamId: 1, nationality: 'Italy', birthdate: '1997-12-30', createdAt: new Date(), updatedAt: new Date() },

      { name: 'Fabio Quartararo', teamId: 2, nationality: 'France', birthdate: '1999-04-20', createdAt: new Date(), updatedAt: new Date() },

      { name: 'Aleix Espargaro', teamId: 4, nationality: 'Spain', birthdate: '1989-07-30', createdAt: new Date(), updatedAt: new Date() },

      { name: 'Marc Marquez', teamId: 3, nationality: 'Spain', birthdate: '1993-02-17', createdAt: new Date(), updatedAt: new Date() },

      { name: 'Joan Mir', teamId: 10, nationality: 'Spain', birthdate: '1997-09-01', createdAt: new Date(), updatedAt: new Date() },

      { name: 'Pol Espargaro', teamId: 3, nationality: 'Spain', birthdate: '1991-06-10', createdAt: new Date(), updatedAt: new Date() },

      { name: 'Jack Miller', teamId: 1, nationality: 'Australia', birthdate: '1995-01-18', createdAt: new Date(), updatedAt: new Date() },

      { name: 'Maverick Vinales', teamId: 4, nationality: 'Spain', birthdate: '1995-01-12', createdAt: new Date(), updatedAt: new Date() },

      { name: 'Valentino Rossi', teamId: 2, nationality: 'Italy', birthdate: '1979-02-16', createdAt: new Date(), updatedAt: new Date() }

    ], {});



  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Riders', null, {});

    await queryInterface.bulkDelete('Teams', null, {});

  }

};