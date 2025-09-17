import { getChannel } from "../config/rabbitmq";
import { getEmailTemplate } from "../utils/emailTemplates";
import { sendEmail } from "../services/emailService";
import { emailJobOptions } from "../config/emailJobOptions";
import { logErrorToGateway } from "../utils/logger";

export const startWorker = async () => {
	const channel = getChannel();

	channel.consume("emailQueue", async (msg: any) => {
		if (!msg) return;

		const job = JSON.parse(msg.content.toString());
		const { to, template, data } = job;
		const options = emailJobOptions[template] || emailJobOptions.default;
		const retries = msg.properties.headers["x-retries"] || 0;

		try {
			const { subject, html } = getEmailTemplate(template, data);
			await sendEmail(to, subject, html);

			channel.ack(msg);
			console.log(`✅ Email sent: ${to}`);
		} catch (err: any) {
			if (retries < options.maxRetries!) {
				const delay =
					options.backoff === "exponential"
						? Math.pow(2, retries) * 1000
						: 5000;

				setTimeout(() => {
					channel.publish(
						"email_exchange",
						"send_email",
						msg.content,
						{
							priority: options.priority,
							headers: { "x-retries": retries + 1 },
						}
					);
				}, delay);

				channel.ack(msg);
				console.warn(`⏳ Retry ${retries + 1} for ${to}`);
			} else {
				await logErrorToGateway("Email failed permanently", {
					job,
					error: err.message,
				});
				channel.publish("email_retry_exchange", "dlq", msg.content);
				channel.ack(msg);
				console.error(`🚨 Email moved to DLQ: ${to}`);
			}
		}
	});
};
