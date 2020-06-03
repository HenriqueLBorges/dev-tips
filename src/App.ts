import express = require("express");
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
    this.app.use(express.json());
    this.registerRouters();
  }

  private registerRouters(): void {
    this.app.use("/cat", Cat as express.Router);
    this.app.use("/api", Api as express.Router);
  }
}

export default new App();
