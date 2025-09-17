import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
	env: process.env.NODE_ENV,
	port: process.env.PORT,
	rabbitmqUrl: process.env.RABBITMQ_URL,
	smtp: {
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT),
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
	logDbUrl: process.env.LOG_DB_URL,
};
