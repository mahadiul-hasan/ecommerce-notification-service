import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export const setupSwagger = (app: Express) => {
	const options = {
		definition: {
			openapi: "3.0.0",
			info: { title: "Notification Service API", version: "1.0.0" },
		},
		apis: ["./src/controllers/*.ts"],
	};

	const spec = swaggerJsdoc(options);
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
};
