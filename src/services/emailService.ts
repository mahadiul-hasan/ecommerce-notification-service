import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, subject: string, html: string) => {
	const transporter = nodemailer.createTransport({
		host: config.smtp.host,
		port: config.smtp.port,
		auth: { user: config.smtp.user, pass: config.smtp.pass },
	});

	await transporter.sendMail({
		from: '"Shop" <no-reply@shop.com>',
		to,
		subject,
		html,
	});
};
