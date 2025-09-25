import mysql from "mysql2/promise";

export const db = await mysql.createPool({
  host: process.env.HOSTNAME || "localhost",
  user: process.env.USER || "root",
  password: process.env.PASSWORD || "",
  database: process.env.DATABASE || "vakilemali",
  waitForConnections: true,
});
