const mysql = require('mysql2')
require('dotenv').config();

const pool = mysql.createPool({
    host: 'localhost' ?? process.env.DEV_DB_MYSQL_HOST,
    user: 'root' ?? process.env.DEV_DB_MYSQL_USER,
    port: '3306' ?? process.env.DEV_DB_MYSQL_PORT,
    password: '123456' ?? process.env.DEV_DB_MYSQL_PASSWORD,
    database: 'shopdev' ?? process.env.DEV_DB_MYSQL_NAME,
})

const BATCH_SIZE = 100000;
const TOTAL_SIZE = BATCH_SIZE * 100;

let curID = 1;

console.time("timer1")
const insertBatch = async () => {
    const values = [];
    for (let i = 0; i < BATCH_SIZE && curID <= TOTAL_SIZE; i++) {
        const name = `name-${curID}`;
        const age = curID;
        const address = `address-${curID}`;
        values.push([curID, name, age, address])
        curID++;
    }

    if (values.length <= 0) {
        pool.end(err => {
            console.timeEnd("timer1");
            if (err) {
                console.error("Error inserting batch: " + err.message);
            } else {
                console.log("Pool connection closed successfully!");
            }
        })
        return;
    }

    const sql = `INSERT INTO users (id, name, age, address) VALUES ?`;
    pool.query(sql, [values], async (err, results) => {
        if (err) throw err;

        console.log(`Inserted ${results.affectedRows} records successfully!`);
        await insertBatch();
    })
}

insertBatch().catch(err => console.error("Error inserting batch: " + err.message))