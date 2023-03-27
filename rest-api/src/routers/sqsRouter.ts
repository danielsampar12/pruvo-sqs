import { Request, Response, Router } from "express";
import {
  sendConversionRequest,
  sendExchangeRateRequest,
} from "../controllers/sqsController";

const router = Router();

router.get("/", (_: Request, res: Response) => {
  return res.send("Express + TypeScript Server!");
});

router.post("/conversionRequest", async (req, res) => {
  try {
    console.log("Received conversion request");
    console.log(req.body);
    //TODO apply more comprehensive request validation in a middleware
    if (!req.body.amount) {
      return res.status(400).send("amount is required");
    }
    const response = await sendConversionRequest(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500);
  }
});

router.post("/exchangeRateRequest", async (req, res) => {
  try {
    console.log("Received exchange rate request");
    const response = await sendExchangeRateRequest(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500);
  }
});

export default router;
