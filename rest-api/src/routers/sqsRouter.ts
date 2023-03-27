import { Request, Response, Router } from "express";
import { sendSQSMessage } from "../controllers/sqsController";
import { ExchangeRateRequestMessage } from "../middlewares/checkExchangeRateRequestProps";

const router = Router();

router.get("/", (_: Request, res: Response) => {
  return res.send("Express + TypeScript Server!");
});

router.post(
  "/conversionRequest",
  async (req: ExchangeRateRequestMessage, res: Response) => {
    try {
      console.log("Received conversion request");
      console.log(req.body);
      //TODO apply more comprehensive request validation in a middleware

      const response = await sendSQSMessage(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500);
    }
  }
);

router.post(
  "/exchangeRateRequest",
  async (req: ExchangeRateRequestMessage, res: Response) => {
    try {
      console.log("Received exchange rate request");
      const response = await sendSQSMessage(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500);
    }
  }
);

export default router;
