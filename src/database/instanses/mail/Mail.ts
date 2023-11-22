import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { IMail } from './Mail.interface';
import appConfig from '../../../config/index.interface';

export class Mail implements IMail {
	sendRegistrationEmail(): Promise<void> {
		throw new Error('Method not implemented.');
	}

	public async sendInviteUserEmail(
		email: string,
		firstName: string,
		token: string,
	): Promise<void> {
		const sub = 'Welcome to PhillysBestPizza';
		try {
			let html = fs.readFileSync(
				`${process.env.NODE_PATH}/resources/templates/InviteUserTemplate.html`,
				'utf-8',
			);
			html = html.replace('{{ name }}', firstName);
			html = html.replace(
				'{{ Setup Link }}',
				`${appConfig.app.frontend.baseUrl}${appConfig.app.frontend.accountSetup}?email=${email}&token=${token}`,
			);
			await Mail.sendMail(email, sub, html);
		} catch (error) {
			console.log(error, 'error');

			throw new Error(`Fail to send mail`);
		}
	}

	private static async sendMail(
		to: string,
		sub: string,
		html: string,
	): Promise<void> {
		const transporter = nodemailer.createTransport({
			host: appConfig.email.host,
			port: appConfig.email.port,
			secure: appConfig.email.secure,
			auth: {
				user: appConfig.email.auth.user,
				pass: appConfig.email.auth.pass,
			},
		});
		// send mail with defined transport object
		await transporter.sendMail({
			from: appConfig.email.fromEmail,
			to: to,
			subject: sub,
			html: html,
		});
	}
}
