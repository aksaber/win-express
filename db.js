const mysql = require('mysql');
const e = require('express');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'a6289651',
    database: 'teleplay',
    multipleStatements: true // 支持执行多条 sql 语句
    // connectionLimit : 10
});
// const pool = mysql.createPool({
//     host: '127.0.0.1',
//     user: 'fsqm',
//     password: 'fsqm@123',
//     database: 'u_fsqm',
//     multipleStatements: true, // 支持执行多条 sql 语句
//     // connectionLimit : 10
// });

query = (sql, callback) => {
    pool.getConnection((err, conn) => {
        conn.query(sql, (err, rows) => {
            callback(err, rows);
            conn.release();
        })
    });
}

queryMore = (sql, tableSql, callback) => {
    pool.getConnection((err, conn) => {
        conn.query(sql, (err, rows) => {
            // callback(err, rows);
            if (tableSql != '') {
                //执行多条sql语句
                let arr = {}
                arr.info = rows;
                conn.query(tableSql, (err2, result) => {
                    arr.total = result[0].total;
                    callback(err2, arr);
                })
            }
            conn.release();
        })
    });
}

// 向外暴露内部变量
exports.query = query;
exports.queryMore = queryMore;