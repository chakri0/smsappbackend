export interface IMail {
	sendRegistrationEmail(): Promise<void>;
	sendInviteUserEmail(
		email: string,
		name: string,
		token: string,
	): Promise<void>;

	sendForgotPasswordEmail(email: string, token: string): Promise<void>;
}
