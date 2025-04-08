import { env } from '$env/dynamic/private';
import { createTransport } from 'nodemailer';

const mailer = createTransport({
	host: env.SMTP_HOST,
	port: env.SMTP_PORT,
	secure: env.SMTP_SECURE,
	auth:
		env.SMTP_SECURITY === 'plain'
			? undefined
			: {
					user: env.SMTP_USER,
					pass: env.SMTP_PASS
				}
});

interface SendMailOptions {
	from: string;
	to: string;
	subject: string;
	text?: string;
	html?: string;
}

export async function sendMail(options: SendMailOptions) {
	const { from, to, subject, text, html } = options;

	const mailOptions = {
		from,
		to,
		subject,
		text,
		html
	};

	await mailer.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log('Mailer error:\n', error);
		} else {
			console.log('Mailer info:\n', info.response);
		}
	});
}
