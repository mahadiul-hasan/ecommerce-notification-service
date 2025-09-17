import axios from "axios";
import config from "../config";

export const logErrorToGateway = async (message: string, meta?: any) => {
	try {
		await axios.post(`${config.logDbUrl}`, {
			level: "error",
			service: "notification-service",
			message,
			meta,
		});
	} catch (err: any) {
		console.error("❌ Failed to log to database:", err.message);
	}
};
