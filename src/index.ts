import express from "express";
import dotenv from "dotenv";
import { setupSwagger } from "./swagger";
import config from "./config";
import { getEmailTemplate } from "./utils/emailTemplates";
import { connectRabbitMQ } from "./config/rabbitmq";
import { startWorker } from "./worker/emailWorker";

dotenv.config();

const app = express();
app.use(express.json());

setupSwagger(app);

app.get("/emails/templates", getEmailTemplate);
app.get("/health", (req, res) => res.json({ ok: true }));

app.listen(config.port, async () => {
	console.log(`🚀 Notification Service running on port ${config.port}`);
	await connectRabbitMQ();
	startWorker();
});
