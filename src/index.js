const express = require("express");
const app = express();
const routes = require("./config/routes");
const mongoose = require("mongoose");
const config = require("./config/env/index");
const port = process.env.PORT || 4000;
const cors = require("cors");

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(routes);

mongoose
  .connect(config.mongoUrl)
  .then(() => {
    app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });

function listen() {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}
