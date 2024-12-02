## Project Overview 
This project provides a NestJS-based backend service that manages user authentication, user management, and document managment. The backend communicates with a Python that listens for events from RabbitMQ and processes them. This architecture follows a microservices design pattern, with RabbitMQ facilitating communication between the NestJS and Python services.

## Features
NestJS Backend:

User authentication (register, login, JWT token management).
User management APIs (admin-only access to manage roles).
Document management APIs (CRUD operations for documents).
Ingestion Trigger API (to trigger document processing in the Python service).
RabbitMQ communication to trigger ingestion in the Python service.

## Technology Stack
Backend (NestJS): TypeScript, NestJS, PostgreSQL, JWT for authentication.
Microservices Communication: RabbitMQ
Database: PostgreSQL
ORM :Sequelize

## Prerequisites
Node.js (for NestJS)
PostgreSQL (or other relational databases)
RabbitMQ (for messaging between NestJS and Python service)

## Database Setup
1. Install postgress on your machine 
2. Create the database for the project 
3. Add the database credentaials in env file 

## Project setup

```bash
$ npm install
```

## env variables setup
set a up .env file in the root directory of the project and create vars that are available in config/config.contants.ts and config/databas.provider.ts

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

To deploy the NestJS service:
1. Build the Application with the command 
```bash
$ npm  run build
```
2. Deploy the application using the dist folder which is in the project directory
