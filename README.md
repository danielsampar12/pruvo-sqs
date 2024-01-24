# Description

This project is developed to address the coding assessment challenge provided by Pruvo.

The assignment creates scenario where a WordPress frontend site needs to add a new functionality to allow users to get a conversion rate between 2 selected currencies. This project implements a backend service that will serve this need.

# Commands
To startup all the services run the following command
```
docker-compose up
```

# Solution Architecture

This solution uses an AWS SQS queue to defer user requests for asynchronous processing.

A Nestjs standalone application is used to listen on messages from the queue and process them. The code is in the `converter-api` folder.

In order to facilitate the development process, there is an Expressjs application located in the rest-api directory. This application provides a server that exposes a POST request endpoint (/sqs/conversionRequest) which can be used to send messages to the SQS queue.

If I were deploying this application in a live setting, I would leverage the benefits of AWS services to optimize the performance and reduce costs. For example, I could use AWS API Gateway which offers seamless integration with AWS SQS, allowing me to expose the necessary endpoints without running an expensive REST API server.

To host the Nestjs application, I would utilize EC2 instances with appropriate memory and CPU limits. These instances could be managed by an Auto Scaling Group, which could automatically adjust the number of instances to maintain an optimum performance level. I could also set scaling metrics such as average memory or CPU utilization of the EC2 instances to ensure efficient resource allocation. Alternatively, I could consider using AWS Lambda to handle messages as it provides a cost-effective and scalable solution for message processing.

## Frontend
To interact with the application, simply navigate to http://localhost:3000. The application features a user interface that allows you to submit requests easily. The UI is built using Alpine.js and Tailwind CSS, providing a clean and responsive design.

<img width="1439" alt="image" src="https://user-images.githubusercontent.com/54335160/228325712-d7fd6e0c-cabe-4521-81d6-432b8e474780.png">

# Prerequisites
- Docker
- docker-compose
- An account with https://openexchangerates.org/

To be able to use the exchange rate api, place a .env file in converter-api folder with the key OPEN_EX_APP_ID to set to the account's App ID.

# Load testing
## Stress testing results
![73ea5152-23df-4dbf-a2c5-0d063eb6c00f](https://user-images.githubusercontent.com/54335160/228328382-4d88ac29-9a3a-4d8b-a969-60f808c8ef55.JPG)

