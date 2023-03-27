import { Squiss } from "squiss-ts";

const awsConfig = {
  accessKeyId: `dummy`,
  secretAccessKey: `dummy`,
  region: "eu-west-1",
};

const squiss = new Squiss({
  awsConfig,
  queueUrl: "http://sqs:9324/queue/default",
  bodyFormat: "json",
  maxInFlight: 15,
});

interface ExchangeRateRequestMessage {
  /**
   * The base ('from') currency (3-letter code)
   */
  fromCurrency: string;
  /**
   * The target ('to') currency (3-letter code)
   */
  toCurrency: string;
  /**
   * The email to receive the result at
   */
  email: string;
  /**
   * The value to be converted
   */
  amount: number;
}

interface ConversionRequestMessage extends ExchangeRateRequestMessage {
  amount: number;
}

type MessageBody = ExchangeRateRequestMessage | ConversionRequestMessage;

async function sendSQSMessage(
  body: MessageBody,
  requestType: "conversion_request" | "exchange_rate_request"
) {
  const messageToSend = {
    name: requestType,
    message: body,
  };
  try {
    console.log("Sending Message to SQS");
    const result = await squiss.sendMessage(messageToSend, 0);
    console.log("Response:", result);
    console.log("Message sent!");
    return result;
  } catch (error) {
    console.log("Error:", error);
  }
}

export async function sendConversionRequest(body: ConversionRequestMessage) {
  try {
    console.log("Sending conversion request");
    const response = await sendSQSMessage(body, "conversion_request");
    return response;
  } catch (error) {
    console.log("Error:", error);
    throw new Error("Internal Server Error");
  }
}

export async function sendExchangeRateRequest(
  body: ExchangeRateRequestMessage
) {
  try {
    const response = await sendSQSMessage(body, "exchange_rate_request");
    return response;
  } catch (error) {
    console.log("Error:", error);
    throw new Error("Internal Server Error");
  }
}
