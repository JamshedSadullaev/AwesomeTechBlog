const path = require("path");
const express = require("express");
const session = require("express-session");
const { sequelize, sessionConfig } = require("./config/connection");
const exphbs = require("express-handlebars");
const controllers = require("./controllers");

const PORT = process.env.PORT || 3001;
const app = express();
const hbs = exphbs.create();

// Middleware
app.use(session(sessionConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "public")));

app.use(controllers);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running at localhost:" + PORT);
  });
});