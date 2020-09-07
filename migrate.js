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
  function (err, conn) {
    if (err) throw err;

    r.tableList().run(conn, (err, cursor) => {
      if (err) throw err;
      cursor.toArray((err, tables) => {
        if (err) throw err;

        // Check if articles table exists
        if (!tables.includes("articles")) {
          // Table missing --> create
          console.log("Creating articles table");
          r.tableCreate("articles").run(conn, (err, _) => {
            if (err) throw err;
            console.log("Creating articles table -- done");
          });
        }

        // Check if stats table exists
        if (!tables.includes("stats")) {
          // Table missing --> create
          console.log("Creating stats table");
          r.tableCreate("stats").run(conn, (err, _) => {
            if (err) throw err;
            console.log("Creating stats table -- done");
            // Create index
            r.table("stats")
              .indexCreate("article_date", [r.row("article_id"), r.row("date")])
              .run(conn, (err, _) => {
                if (err) throw err;
                console.log("Creating article-date secondary index -- done");
              });
          });
        }
      });
    });
  }
);
