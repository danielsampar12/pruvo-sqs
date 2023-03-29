import { Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ConversionRequestMessage } from 'src/messages/messages.service';

@Injectable()
export class ConversionService {
  constructor(private readonly httpService: HttpService) {}

  // ! Free plan only offers requests for the base currency USD
  private api = `https://openexchangerates.org/api/latest.json?app_id=${process.env.OPEN_EX_APP_ID}&base=USD`;

  private getLatestRatesByUSD(): Promise<AxiosResponse<any>> {
    return this.httpService.axiosRef.get(this.api);
  }

  async getCurrencyExchangeRateRelativeToUSD(
    currency: string,
  ): Promise<number> {
    try {
      const { data } = await this.getLatestRatesByUSD();

      if (!data.rates[currency]) {
        const errorMessage = `Currency ${currency} not supported.`;
        console.log(errorMessage);
        throw new Error(errorMessage);
      }

      return Number(data.rates[currency]).valueOf();
    } catch (error) {
      if (
        error?.response?.status === 429 ||
        error?.includes('[AxiosError: Request failed with status code 429]')
      ) {
        throw new Error(
          'Your App Id has been restricted because there was too many requests. Please add a valid App Id in the /converter-api/.env file with the key OPEN_EX_APP_ID.',
        );
      }

      throw new Error(error);
    }
  }

  async convertToUSD(amount: number, currency: string): Promise<number> {
    try {
      const rate = await this.getCurrencyExchangeRateRelativeToUSD(currency);

      return amount / rate;
    } catch (error) {
      throw Error(error);
    }
  }

  async convertFromUSD(amount: number, currency: string): Promise<number> {
    try {
      const rate = await this.getCurrencyExchangeRateRelativeToUSD(currency);

      return rate * amount;
    } catch (error) {
      throw new Error(error);
    }
  }

  async handleConversionRequest({
    amount,
    fromCurrency,
    toCurrency,
  }: ConversionRequestMessage) {
    if (fromCurrency === toCurrency) return amount;

    try {
      if (fromCurrency === 'USD') {
        return await this.convertFromUSD(amount, toCurrency);
      }

      if (toCurrency === 'USD') {
        return await this.convertToUSD(amount, fromCurrency);
      }

      const amountInUSD = await this.convertToUSD(amount, fromCurrency);
      return await this.convertFromUSD(amountInUSD, toCurrency);
    } catch (error) {
      console.log(error);
    }
  }
}
