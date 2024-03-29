import cors from "cors";
import dotenv from "dotenv";
import mongoose, { connect } from "mongoose";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import express, { Application, Request, Response, NextFunction } from "express";

import AppError from "./Utilities/Errors/appError";
import { errorHandler } from "./Middlewares/Errors/errorMiddleware";
import router from "./Routes/index";

dotenv.config();

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! shutting down...");
  process.exit(1);
});

mongoose.set("debug", true);
mongoose.Promise = global.Promise;
const database = String(process.env.MONGO_DB_URL);

// Initialize express
const app: Application = express();

// Port
const PORT: number = Number(process.env.PORT) || 5000;
const address = `0.0.0.0:${PORT}`;

// set security Http headers
app.use(helmet());

app.options("*", cors());

app.use(
  cors({
    origin: ["http://localhost:4000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

// body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

// Data sanitization against noSQL query injection
app.use(mongoSanitize());

// prevent parameter pollution
app.use(hpp({}));

// Define index route
app.get("/", async (req: Request, res: Response) => {
  res.contentType("json");
  res.json({ status: "ok", message: "Welcome to VZY-Project" });
});

// Routes
app.use("/api/v1", router);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`can't find ${req.originalUrl} on server!`, 404));
});

app.use(errorHandler);

// Listen for server connections
const server = app.listen(PORT, async () => {
  async function run() {
    try {
      await connect(database);
      console.log(`Connection to database successful ${database}`);
      console.log(`Server started on PORT https://localhost:${address}`);
    } catch (error) {
      console.log(`Trouble connecting to Database with error: ${error}`);
    }
  }
  run().catch(console.dir);
});

process.on("unhandledRejection", (err: any) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

export default server;
