import cors = require("cors");
import express = require("express");
import path from "path";
import Logger from "./utils/Logger";

// Routers
import Api from "./routers/Api";
import Cat from "./routers/Cat";

class App {
  private app: express.Application = express();
  private port: string = process.env.port || process.env.PORT || "3030";

  constructor() {
    this.config();

    this.app.listen(this.port, () => {
      Logger.info(`dev-tips listening on port ${this.port}`);
    });
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.set("views", path.join(__dirname, "/views"));
    this.app.use(express.static(path.join(__dirname, "/views")));
    this.app.set("view engine", "ejs");
    this.registerRouters();
  }

  private registerRouters(): void {
    this.app.use("/cat", Cat as express.Router);
    this.app.use("/api", Api as express.Router);
    this.app.get("/", (req, res) => {
      res.render("index");
    });
    this.app.get("/index", (req, res) => {
      res.render("index.html");
    });
    this.app.get("/cadastro", (req, res) => {
      res.render("cadastro.html");
    });
    this.app.get("/criar_dica", (req, res) => {
      res.render("criar_dica.html");
    });
    this.app.get("/login", (req, res) => {
      res.render("login.html");
    });
    this.app.get("/home", (req, res) => {
      res.render("home.html");
    });
  }
}

export default new App();
