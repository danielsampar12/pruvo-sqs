import { Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ConversionRequestMessage } from 'src/messages/messages.service';

@Injectable()
export class ConversionService {
  constructor(private readonly httpService: HttpService) {}

  // ! Free plan only offers requests for the base currency USD
  private api = `https://openexchangerates.org/api/latest.json?app_id=131ceac46bda47ab82fd992662d12f7d&base=USD`;

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
      console.log('Error calling API');
      throw new Error(error);
    }
  }

  async convertToUSD(amount: number, currency: string): Promise<number> {
    const rate = await this.getCurrencyExchangeRateRelativeToUSD(currency);

    return amount / rate;
  }

  async convertFromUSD(amount: number, currency: string): Promise<number> {
    const rate = await this.getCurrencyExchangeRateRelativeToUSD(currency);

    return rate * amount;
  }

  async handleConversionRequest({
    amount,
    fromCurrency,
    toCurrency,
  }: ConversionRequestMessage) {
    if (fromCurrency === toCurrency) return amount;

    if (fromCurrency === 'USD') {
      return await this.convertFromUSD(amount, toCurrency);
    }

    if (toCurrency === 'USD') {
      return await this.convertToUSD(amount, fromCurrency);
    }

    const amountInUSD = await this.convertToUSD(amount, fromCurrency);
    return await this.convertFromUSD(amountInUSD, toCurrency);
  }
}
