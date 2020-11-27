module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'userComments',
      {
        type: Sequelize.STRING,
        allowNull: true,
      });
    await queryInterface.addColumn('orders', 'riderComments',
      {
        type: Sequelize.STRING,
        allowNull: true,
      });
    await queryInterface.sequelize.query("ALTER TYPE enum_orders_status ADD VALUE 'arrived'");
  },

  down: async (queryInterface, Sequelize) => {
    const query = 'DELETE FROM pg_enum '
      + 'WHERE enumlabel = \'arrived\' '
      + 'AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = \'enum_orders_status\')';
    await queryInterface.removeColumn('orders', 'userComments');
    await queryInterface.removeColumn('orders', 'riderComments');
    await queryInterface.sequelize.query(query);
  },
};
