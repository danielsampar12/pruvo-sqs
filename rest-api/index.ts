import express, { Express } from "express";
import dotenv from "dotenv";
import sqsRouter from "./src/routers/sqsRouter";
import path from "path";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const dir = process.env.PWD;

app.use(express.static(path.join(dir || __dirname, "public")));

app.use(express.json());
app.use("/sqs", sqsRouter);

app.listen(port, () => {
  console.log(`node[server]: Server is running at https://localhost:${port}`);
});
