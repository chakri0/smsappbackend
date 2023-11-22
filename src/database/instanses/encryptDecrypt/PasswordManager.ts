// import bcrypt from 'bcrypt';
import { hash, compare } from 'bcrypt';

export class PasswordManager {
	saltRounds: number;
	constructor(saltRounds = 10) {
		this.saltRounds = saltRounds;
	}

	async hashPassword(plainPassword: string) {
		try {
			const hashedPassword: string = await hash(
				plainPassword,
				this.saltRounds,
			);
			return hashedPassword;
		} catch (error) {
			throw new Error('Password hashing failed');
		}
	}

	async comparePassword(plainPassword: string, hashedPassword: string) {
		try {
			const isMatch: boolean = await compare(
				plainPassword,
				hashedPassword,
			);
			return isMatch;
		} catch (error) {
			throw new Error('Password comparison failed');
		}
	}
}
