# Description

This project is developed to address the coding assessment challenge provided by Pruvo.

The assignment creates scenario where a WordPress frontend site needs to add a new functionality to allow users to get a conversion rate between 2 selected currencies. This project implements a backend service that will serve this need.

# Commands
To startup all the services run the following command
```
docker-compose up
```

# Solution Architecture

This solution uses an AWS SQS queue to defer user requests for asynchronous processing. (Uses alpine-sqs to simulate it locally).

A Nestjs standalone application is used to listen on messages from the queue and process them. This is the code in the `converter-api` folder.

For the purpose of local development, an Expressjs application is available in the `rest-api` folder. This server exposes the `/sqs/conversionRequest` post requests that will be placed in the SQS queue.

In a production environment, I would use AWS API Gateway which has a direct integration with AWS SQS to expose these endpoints and save on the costs of a running REST Api server. The Nestjs application could be hosted on EC2 instances with the required memory & CPU limits, and controlled by an Auto Scaling Group that scales up to a maximum of 3 instances. The scaling metric could be either the average memory or CPU utilization of the EC2 instances. Or even use AWS Lambda for handling the messages.

## Frontend
You can access http://localhost:3000 to use a UI for the request. It's just a simple page implemented with Alpine.js and Tailwind css.

<img width="1439" alt="image" src="https://user-images.githubusercontent.com/54335160/228325712-d7fd6e0c-cabe-4521-81d6-432b8e474780.png">


# Prerequisites
- Nodejs 16
- Docker
- docker-compose
- An account with https://openexchangerates.org/

