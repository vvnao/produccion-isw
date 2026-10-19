"use strict";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import router from "./src/routes/index.routes.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";
import prisma from "./src/config/prisma.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 80;
const WEB_PORT = process.env.WEB_PORT || 443;

function setupAPI() {
  const app = express();
  app.disable("x-powered-by");
  app.use(cors({ credentials: true, origin: true }));
  app.use(express.json());
  app.use(morgan("dev"));

  app.use("/api", router);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`API corriendo en puerto ${PORT}`);
  });
}

function setupWeb() {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  const web = express();
  web.disable("x-powered-by");

  web.use(express.static(frontendPath));
  web.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });

  web.listen(WEB_PORT, () => {
    console.log(`Frontend en puerto ${WEB_PORT}`);
  });
}

async function main() {
  try {
    await prisma.$connect();
    console.log("=> ConexiÃ³n a PostgreSQL establecida");
    setupAPI();
    setupWeb();
    console.log("=> Servidores iniciados");
  } catch (error) {
    console.error("Error en index.js -> main(): ", error);
    process.exit(1);
  }
}

main();