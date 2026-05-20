import mysql from "mysql2"
import { config } from "dotenv"
config()
console.log(process.env.DB_HOST)
const db = mysql.createConnection({
    host : process.env.DB_HOST || '',
    user : process.env.DB_USER || '',
    password : process.env.DB_PASSWORD || '',
    database : process.env.DB_NAME || ''
})

db.connect((err)=>{
    if (err) throw err
    console.log("db connect successfully")
})

export default db;

