import amqp from "amqplib";
import config from "./index";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
	const connection = await amqp.connect(config.rabbitmqUrl as string);
	channel = await connection.createChannel();

	// Main exchange
	await channel.assertExchange("email_exchange", "direct", { durable: true });

	// Main queue
	await channel.assertQueue("emailQueue", {
		durable: true,
		maxPriority: 5,
		deadLetterExchange: "email_retry_exchange",
	});

	// Retry exchange
	await channel.assertExchange("email_retry_exchange", "direct", {
		durable: true,
	});

	// DLQ for failed jobs
	await channel.assertQueue("emailDLQ", { durable: true });

	// Bind queues
	await channel.bindQueue("emailQueue", "email_exchange", "send_email");
	await channel.bindQueue("emailDLQ", "email_retry_exchange", "dlq");

	console.log("✅ RabbitMQ connected and queues/exchanges set up");

	return channel;
};

export const getChannel = () => {
	if (!channel) throw new Error("RabbitMQ channel not initialized");
	return channel;
};
