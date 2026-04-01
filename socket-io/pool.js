import mysql from "mysql2/promise";

const pool = mysql.createPool({
  user: "root",
  host: "localhost",
  password: "",
  database: "socket-io-basics",
});

export default pool;
