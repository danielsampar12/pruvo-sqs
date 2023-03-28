import { NextFunction, Request, Response } from "express";

export interface ExchangeRateRequestMessage extends Request {
  body: {
    toCurrency: string;
    fromCurrency: string;
    email: string;
    amount: number;
  };
}

export function checkExchangeRateRequestProps(
  req: ExchangeRateRequestMessage,
  res: Response,
  next: NextFunction
) {
  const { amount, email, fromCurrency, toCurrency } = req.body;

  if (amount < 0) {
    return res.status(400).send("Amount must be positive.");
  }

  if (!email) {
    return res.status(400).send("Missing email.");
  }

  if (!fromCurrency || !toCurrency) {
    return res
      .status(400)
      .send(
        `Inform the 2 currencies. (ex: "fromCurrency": "USD", "toCurrency": "BRL")`
      );
  }

  if (fromCurrency.length < 3 || toCurrency.length < 3) {
    return res.status(400).send("Currency must be with 3 letter. (ex: USD)");
  }

  next();
}
