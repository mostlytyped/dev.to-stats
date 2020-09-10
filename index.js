// index.js

// Express app
const express = require("express");
const app = express();

// Logging middleware
const morgan = require("morgan");
app.use(morgan("combined"));

// Serve frontend
app.use(express.static("public"));

// Lazy RethinkDB connection
const r = require("rethinkdb");
const { getRethinkDB } = require("./reql.js");

// Route to get stats
app.get("/article_stats", async (req, res) => {
  const conn = await getRethinkDB();
  let article_cursor = await r.table("articles").run(conn);
  let articles = await article_cursor.toArray();
  let article_stats = await Promise.all(
    articles.map(async (article) => {
      let stats_cursor = await r
        .table("stats")
        .filter({ article_id: article.id })
        .orderBy(r.asc("date"))
        .run(conn);
      let stats = await stats_cursor.toArray();
      article.stats = stats;
      return article;
    })
  );
  res.json(article_stats);
});

// Start server
const listenPort = process.env.PORT || "3000";
app.listen(listenPort, () => {
  console.log(`Listening on ${listenPort}`);
});
