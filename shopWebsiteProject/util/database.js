const mysql = require('mysql2')

const pool = mysql.createPool({
    host:'localhost',
    user:'tuyentrinh',
    database:'nodeComplete',
    password:'123456'
})

module.exports = pool.promise()