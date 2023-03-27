import express, { Express } from 'express';
import dotenv from 'dotenv';
import sqsRouter from "./src/routers/sqsRouter";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json())
app.use('/sqs', sqsRouter)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});