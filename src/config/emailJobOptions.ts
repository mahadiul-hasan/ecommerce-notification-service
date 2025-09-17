export type EmailJobOption = {
	priority?: number; // lower = higher? (Rabbit priority numeric; pick range 0..10)
	maxRetries?: number; // total attempts allowed (including first)
	baseDelay?: number; // base ms for backoff calculation
	backoff?: "exponential" | "fixed";
};

export const emailJobOptions: Record<string, EmailJobOption> = {
	default: {
		priority: 3,
		maxRetries: 3,
		baseDelay: 1000,
		backoff: "exponential",
	},

	// Authentication / account flows
	activateUser: {
		priority: 1,
		maxRetries: 3,
		baseDelay: 2000,
		backoff: "exponential",
	},
	activateSeller: {
		priority: 1,
		maxRetries: 3,
		baseDelay: 2000,
		backoff: "exponential",
	},

	// User-oriented flows
	forgotPassword: {
		priority: 1,
		maxRetries: 3,
		baseDelay: 5000,
		backoff: "fixed",
	},
	welcome: {
		priority: 4,
		maxRetries: 2,
		baseDelay: 1000,
		backoff: "exponential",
	},

	// Transactional flows
	orderConfirmation: {
		priority: 2,
		maxRetries: 5,
		baseDelay: 3000,
		backoff: "exponential",
	},
	paymentConfirmation: {
		priority: 1,
		maxRetries: 5,
		baseDelay: 2000,
		backoff: "exponential",
	},
};
