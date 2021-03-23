const cookies = require("cookies");
const express = require("express");
const middleware = require("./middleware");
const config = require("../global/config.json");
const methodOverride = require("method-override");

const authRoutes = require("./routes/auth-routes");
const dashboardRoutes = require("./routes/dashboard-routes");
const rootRoutes = require("./routes/root-routes");

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "pug");

app.use(cookies.express("a", "b", "c"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ encoded: true, extended: true }));

app.use(express.static(`${__dirname}/assets`));
app.locals.basedir = `${__dirname}/assets`;

app.use(
  "/",
  authRoutes,
  middleware.updateUser,
  rootRoutes,
  middleware.validateUser,
  middleware.updateGuilds,
  dashboardRoutes
);

app.get("*", (req, res) => res.render("errors/404"));

const port = config.dashboard.port || 4000;
app.listen(port, () => console.log(`Server is live on port ${port}`));
