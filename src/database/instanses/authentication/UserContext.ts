import { User } from '../../entities/User';

export class UserContext {
	private static user: User;

	static storeUserDetails(user: User) {
		UserContext.user = user;
	}

	static getActiveUser() {
		return UserContext.user;
	}
}
