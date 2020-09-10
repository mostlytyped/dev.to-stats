// reql.js

const r = require("rethinkdb");

let rdbConn = null;
const rdbConnect = async function () {
  try {
    const conn = await r.connect({
      host: process.env.RETHINKDB_HOST || "localhost",
      port: process.env.RETHINKDB_PORT || 28015,
      username: process.env.RETHINKDB_USERNAME || "admin",
      password: process.env.RETHINKDB_PASSWORD || "",
      db: process.env.RETHINKDB_NAME || "test",
    });

    // Handle close
    conn.on("close", function (e) {
      console.log("RDB connection closed: ", e);
      rdbConn = null;
    });
    // Handle error
    conn.on("error", function (e) {
      console.log("RDB connection error occurred: ", e);
      conn.close();
    });
    // Handle timeout
    conn.on("timeout", function (e) {
      console.log("RDB connection timed out: ", e);
      conn.close();
    });

    console.log("Connected to RethinkDB");
    rdbConn = conn;
    return conn;
  } catch (err) {
    throw err;
  }
};
exports.getRethinkDB = async function () {
  if (rdbConn != null) {
    return rdbConn;
  }
  return await rdbConnect();
};
