# Notification Service

**Notification Service** is a microservice responsible for sending emails in a **multivendor e-commerce application**. It is built with **Node.js, TypeScript, RabbitMQ, and Nodemailer**. The service supports:

-   Email templates (activate user/seller, welcome, forgot password, order confirmation, payment confirmation, etc.)
-   Priority-based email handling
-   Retry mechanism with **Dead Letter Exchange (DLX)** for failed jobs
-   Error logging integration with **API Gateway**
-   Fully decoupled via RabbitMQ (no public HTTP routes required)

---

## Table of Contents

1. [Architecture Diagram](#architecture-diagram)
2. [Features](#features)
3. [Folder Structure](#folder-structure)
4. [Installation](#installation)
5. [Environment Variables](#environment-variables)
6. [Scripts](#scripts)
7. [Usage](#usage)
8. [Publishing Messages](#publishing-messages)
9. [Contributing](#contributing)
10. [License](#license)

---

## Architecture Diagram

```text
          +------------------+
          |   Auth Service   |
          +--------+---------+
                   |
                   | Publish Job
                   v
          +------------------+
          |  RabbitMQ Broker |
          +--------+---------+
                   |
          +--------+---------+
          | NotificationSvc |
          |  (Consumer)     |
          +-----------------+
                   |
                   v
          +------------------+
          |     Nodemailer   |
          |     Email SMTP   |
          +------------------+
```

## Flow Explanation

1. **Publisher services** (Auth, Order, Payment, Vendor) send a message to RabbitMQ (email or user creation jobs).

2. **Notification Service** consumes messages from RabbitMQ queues.

3. Emails are sent using **Nodemailer**.

4. If sending fails, the message is retried using a **delay queue** and eventually moved to a **Dead Letter Queue (DLQ)** after max retries.

5. Errors are logged to the **API Gateway** for monitoring.

## Features

-   ### Email Templates

    -   `activateUser`

    -   `activateSeller`

    -   `forgotPassword`

    -   `welcome`

    -   `orderConfirmation`

    -   `paymentConfirmation`

    -   `default`

-   **Priority-based email queue**

-   **Retry with backoff (exponential/fixed)**

-   **Dead Letter Queue for failed emails**

-   **Error logging to API Gateway**

-   **Fully internal microservice (no public HTTP endpoints)**

## Folder Structure

```
notification-service/
│
├─ src/
│   ├─ config/
│   │   ├─ index.ts               # config variables (.env)
│   │   └─ emailJobOptions.ts     # email job retry/backoff/priority configs
│   │
│   ├─ services/
│   │   └─ rabbitmqService.ts     # RabbitMQ connection and helper functions
│   │
│   ├─ utils/
│   │   ├─ emailTemplates.ts      # All email template functions
│   │   └─ publisher.ts           # Helper to publish messages to RabbitMQ
│   │
│   ├─ worker/
│   │   └─ emailWorker.ts         # Consumes messages and sends emails
│   │
│   └─ index.ts                   # Service entry point
│
├─ package.json
├─ tsconfig.json
├─ .env.example
└─ README.md
```

## Installation

```
# Clone repository
git clone <repo-url>
cd notification-service

# Install dependencies
npm install
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```
PORT=5012
RABBITMQ_URL=amqp://guest:guest@localhost:5672
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-smtp-password
API_GATEWAY_LOG_URL=http://api-gateway.local/logs
```

## Scripts

```
# Development
npm run dev            # run Notification Service
npm run dev:worker     # run worker only (consumes email jobs)

# Build
npm run build

# Production
npm run start          # run compiled service
npm run worker         # run compiled worker
```

## Usage

1. **Start RabbitMQ** (locally or Docker):

```
docker run -d --hostname rabbit --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

2. **Start Notification Service**

```
npm run dev          # or npm run start after build
npm run dev:worker   # or npm run worker after build
```

3. **Publish an email job** from any internal service:

```
import { publishMessage } from 'notification-service/src/utils/publisher';

await publishMessage({
  exchange: 'email_exchange',
  routingKey: 'send_email',
  data: {
    template: 'activateUser',
    to: 'customer@example.com',
    data: { name: 'John Doe', code: '123456' },
  },
});
```

## Publishing Messages

Notification service uses **RabbitMQ** only. Other services (Auth, Vendor, Order, Payment) can publish messages to different exchanges:

-   **Email jobs**: `email_exchange`

-   **User profile creation**: `user_exchange` (routing keys: `customer.create`, `vendor.create`, `admin.create`)

Notification service **does not expose public APIs**, so only services that can publish to RabbitMQ can send jobs.

## Contributing

-   Use TypeScript and maintain strict typing.

-   Follow folder structure.

-   Test locally with RabbitMQ before committing.

## License

MIT License © 2025

```
✅ This README.md will **render properly with headings, code blocks, lists, bold text, and sections** when viewed in VSCode or GitHub — all content stays inside the Markdown file.

---

If you want, I can also **create a visual PNG/SVG diagram** of the RabbitMQ + Notification Service flow and embed it into this Markdown so it looks professional for documentation or wiki.

Do you want me to do that?
```
