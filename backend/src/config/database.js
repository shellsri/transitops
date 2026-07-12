const { Sequelize } = require('sequelize');

// 🔥 DIRECT CONNECTION (No .env, no process.env)
// This will 100% work because we know your MySQL password is 'root'
const sequelize = new Sequelize('transitops', 'root', 'root', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  logging: false
});

// Test the connection immediately
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
}
testConnection();

module.exports = sequelize;