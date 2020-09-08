// migrate.js

var r = require("rethinkdb");

r.connect(
  {
    host: process.env.RETHINKDB_HOST || "localhost",
    port: process.env.RETHINKDB_PORT || 28015,
    username: process.env.RETHINKDB_USERNAME || "admin",
    password: process.env.RETHINKDB_PASSWORD || "",
    db: process.env.RETHINKDB_NAME || "test",
  },
  async function (err, conn) {
    if (err) throw err;
    console.log("Get table list");
    let cursor = await r.tableList().run(conn);
    let tables = await cursor.toArray();

    // Check if articles table exists
    if (!tables.includes("articles")) {
      // Table missing --> create
      console.log("Creating articles table");
      await r.tableCreate("articles").run(conn);
      console.log("Creating articles table -- done");
    }

    // Check if stats table exists
    if (!tables.includes("stats")) {
      // Table missing --> create
      console.log("Creating stats table");
      await r.tableCreate("stats").run(conn);
      console.log("Creating stats table -- done");
      // Create index
      await r
        .table("stats")
        .indexCreate("article_date", [r.row("article_id"), r.row("date")])
        .run(conn);
      console.log("Creating article-date secondary index -- done");
    }

    await conn.close();
  }
);
