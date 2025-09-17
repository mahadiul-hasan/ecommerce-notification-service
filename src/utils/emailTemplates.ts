export type EmailContent = { subject: string; html: string; text: string };

export function getEmailTemplate(template: string, data: any): EmailContent {
	const name = data?.name ?? "Customer";

	switch (template) {
		case "activateUser":
			return {
				subject: "Activate your account",
				html: `<h2>Hello ${name}</h2><p>Please use the following activation code:</p><h3>${
					data?.code ?? ""
				}</h3>`,
				text: `Hello ${name}. Activation code: ${data?.code ?? ""}`,
			};

		case "activateSeller":
			return {
				subject: "Activate your seller account",
				html: `<h2>Hello ${name}</h2><p>Use this code to activate your seller account:</p><h3>${
					data?.code ?? ""
				}</h3>`,
				text: `Hello ${name}. Seller activation code: ${
					data?.code ?? ""
				}`,
			};

		case "forgotPassword":
			return {
				subject: "Password reset code",
				html: `<p>Hello ${name},</p><p>Your password reset code: <strong>${
					data?.code ?? ""
				}</strong></p>`,
				text: `Password reset code: ${data?.code ?? ""}`,
			};

		case "welcome":
			return {
				subject: "Welcome to our platform!",
				html: `<h1>Welcome, ${name}!</h1><p>Thanks for joining us.</p>`,
				text: `Welcome, ${name}! Thanks for joining us.`,
			};

		case "orderConfirmation":
			return {
				subject: `Order ${data?.orderId ?? ""} — ${
					data?.status ?? "Confirmed"
				}`,
				html: `<p>Hello ${name},</p>
               <p>Your order <strong>${
					data?.orderId ?? ""
				}</strong> is <strong>${data?.status ?? ""}</strong>.</p>
               <p>Items: ${
					Array.isArray(data?.items) ? data.items.join(", ") : ""
				}</p>`,
				text: `Your order ${data?.orderId ?? ""} is ${
					data?.status ?? ""
				}.`,
			};

		case "paymentConfirmation":
			return {
				subject: `Payment received for order ${data?.orderId ?? ""}`,
				html: `<p>Hello ${name},</p>
               <p>We received your payment of <strong>${
					data?.amount ?? ""
				}</strong> for order <strong>${
					data?.orderId ?? ""
				}</strong>.</p>`,
				text: `Payment of ${data?.amount ?? ""} received for order ${
					data?.orderId ?? ""
				}.`,
			};

		default:
			return {
				subject: data?.subject ?? "Notification",
				html: data?.html ?? "<p>No template found</p>",
				text: data?.text ?? "No template found",
			};
	}
}
