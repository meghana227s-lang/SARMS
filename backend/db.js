const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sarms_db'
});

async function testConnection() {
    try {
        const connection = await db.getConnection();

        console.log('MySQL connected successfully!');

        connection.release();

    } catch (error) {
        console.error('MySQL connection failed:', error);
    }
}

testConnection();

module.exports = db;