const mysql = require('mysql');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'a6289651',
    database: 'teleplay',
    // connectionLimit : 10
});

query = (sql, callback) => {
    pool.getConnection((err, conn) => {
        conn.query(sql, (err, rows) => {
            callback(err, rows);
            conn.release();
        })
    });
}

// 向外暴露内部变量
exports.query = query;