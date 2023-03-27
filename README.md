# Description

This project is developed to address the coding assessment challenge provided by Pruvo.

The assignment discusses a scenario where a WordPress frontend site needs to add a new functionality to allow users to get a conversion rate between 2 selected currencies. This project implements a backend service that will serve this need.

# Solution Architecture

This solution uses an AWS SQS queue to defer user requests for asynchronous processing.

A Nestjs standalone application is used to listen on messages from the queue and process them. This is the code in the `ConversionRateService` folder.

For the purpose of local development, an Expressjs application is available in the `RestAPI` folder. This server exposes the `/sqs/conversionRequest` and `/sqs/exchangeRateRequest` endpoints to post requests that will be placed in the SQS queue.

In a production environment, I would use AWS API Gateway which has a direct integration with AWS SQS to expose these endpoints and save on the costs of a running REST Api server. The Nestjs application could be hosted on EC2 instances with the required memory & CPU limits, and controlled by an Auto Scaling Group that scales up to a maximum of 3 instances. The scaling metric could be either the average memory or CPU utilization of the EC2 instances.

# Prerequisites
- Nodejs 16
- Docker
- docker-compose
- An account with https://openexchangerates.org/

To be able to use the exchange rate api, and `.env` file must be placed in the `ConversionRateService` folder with the key `APP_ID` set to the account's App ID

# Commands
To startup all the services run the following command
```
docker-compose up
```# pruvo-sqs
