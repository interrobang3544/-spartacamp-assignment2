'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      postId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        foreignKey: true,
        type: Sequelize.INTEGER
      },
      nickname: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      likes: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      }
    });
    await queryInterface.addConstraint("Posts", {
      fields: ["userId"],
      type: "foreign key",
      name: "FK_Posts_Users",
      references: {
        table: "Users",
        field: "userId",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  }
};