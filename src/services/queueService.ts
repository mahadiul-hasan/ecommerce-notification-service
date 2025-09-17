import { getChannel } from "../config/rabbitmq";
import { emailJobOptions } from "../config/emailJobOptions";

export const publishEmailJob = async (job: any) => {
	const channel = getChannel();
	const options = emailJobOptions[job.template] || emailJobOptions.default;

	channel.publish(
		"email_exchange",
		"send_email",
		Buffer.from(JSON.stringify(job)),
		{
			priority: options.priority,
			headers: { "x-retries": 0 },
		}
	);

	console.log("📩 Email job published:", job.template, job.to);
};
