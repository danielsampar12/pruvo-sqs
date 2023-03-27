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
) {}
