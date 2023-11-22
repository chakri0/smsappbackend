import { v4 as uuidv4 } from 'uuid';
import {
	FormattedUserResponse,
	userResponse,
} from '../common/helpers/ResponseHandle';
import { UserDatastore } from '../database/datastores/UserDatastore';
import { ILogin } from '../controllers/responseType/ILogin';
import AccessToken from '../database/entities/AccessToken';
import { AccessTokenDatastore } from '../database/datastores/AccessTokenDatastore';
import AuthenticationService from '../database/instanses/authentication/AuthenticationService';
import { UserRole } from '../database/entities/UserRole';
import { User } from '../database/entities/User';
import { PasswordManager } from '../database/instanses/encryptDecrypt/PasswordManager';
import { BranchDatastore } from '../database/datastores/BranchDatastore';
import { EmailToken, tokenType } from '../database/entities/EmailToken';
import { EmailTokenDatastore } from '../database/datastores/EmailTokenDatastore';
import { Mail } from '../database/instanses/mail/Mail';
import { NotFoundException } from '../common/exception/NotFoundException';

export class UserRepository {
	private userDatastore: UserDatastore;
	private accessTokenDatastore: AccessTokenDatastore;
	private authentication: AuthenticationService;
	private passwordManager: PasswordManager;
	private branchDatastore: BranchDatastore;
	private emailTokenDatastore: EmailTokenDatastore;
	private mail: Mail;
	constructor() {
		this.userDatastore = new UserDatastore();
		this.accessTokenDatastore = new AccessTokenDatastore();
		this.authentication = new AuthenticationService();
		this.branchDatastore = new BranchDatastore();
		this.passwordManager = new PasswordManager();
		this.emailTokenDatastore = new EmailTokenDatastore();
		this.mail = new Mail();
	}

	public async userLogin(email: string, password: string): Promise<ILogin> {
		const userDetail = await this.userDatastore.getUserByEmail(email);
		if (!userDetail) {
			throw new NotFoundException(`User not found`);
		}

		const compare = await this.passwordManager.comparePassword(
			password,
			userDetail.password,
		);
		if (!compare) {
			throw new Error(`Password does not match`);
		}
		const userRole = await this.userDatastore.getUserRoleById(
			userDetail.id,
		);
		if (!userRole) {
			throw new Error(`UserRole not found`);
		}

		const payload = {
			userId: userDetail.id,
			userRoleId: userRole.id,
		};
		const token = this.authentication.getAccessToken(payload);
		const accessToken = new AccessToken();
		accessToken.id = uuidv4();
		accessToken.token = String(token);
		accessToken.role = userRole;
		await this.accessTokenDatastore.storeAccessToken(accessToken);

		const userData = {
			user: userResponse(userDetail),
			accessToken: String(token),
			refreshToken: 'dummy refresh token',
		};
		return userData;
	}

	public async userInvite(
		activeUserId: string,
		firstName: string,
		email: string,
		role: string,
		branchId: string,
	): Promise<void> {
		const userDetail = await this.userDatastore.getById(activeUserId);
		if (!userDetail) {
			throw new NotFoundException(`User not found`);
		}

		const userRole = await this.userDatastore.getUserRoleById(
			userDetail.id,
		);
		if (!userRole) {
			throw new NotFoundException(`UserRole not found`);
		}

		const existUser = await this.userDatastore.getUserByEmail(email);
		if (existUser) {
			if (existUser.role.isVerified) {
				throw new NotFoundException(`User already register`);
			}
			await this.sendSetUpMail(
				existUser.role,
				email,
				existUser.firstName ?? '',
			);
			return;
		}

		if (
			userRole.roleName !== 'superAdmin' &&
			userRole.roleName !== 'admin'
		) {
			throw new NotFoundException(`Do not have access`);
		}

		if (userRole.roleName === 'admin' && role === 'superAdmin') {
			throw new NotFoundException(`you cannot invite this role`);
		}

		const newUser = new User();
		newUser.id = uuidv4();
		newUser.email = email;
		newUser.firstName = firstName;

		if (role !== 'admin' && role !== 'superAdmin') {
			const branchDetials = await this.branchDatastore.getById(branchId);
			if (!branchDetials) {
				throw new NotFoundException(`Branch not found`);
			}
			newUser.branch = branchDetials;
		}
		await this.userDatastore.save(newUser);

		const newRole = new UserRole();
		newRole.id = uuidv4();
		newRole.roleName = role;
		newRole.user = newUser;
		await this.userDatastore.saveUserRole(newRole);
		await this.sendSetUpMail(newRole, email, firstName);
	}

	public async sendSetUpMail(
		userRole: UserRole,
		email: string,
		firstName: string,
	): Promise<void> {
		await this.emailTokenDatastore.deleteTokenByRole(userRole.id);
		const token = new EmailToken();
		token.id = uuidv4();
		token.role = userRole;
		token.token = uuidv4();
		token.tokenType = tokenType.invite;
		await this.emailTokenDatastore.save(token);
		await this.mail.sendInviteUserEmail(email, firstName, token.token);
	}

	public async verifyUser(token: string, email: string): Promise<void> {
		const tokenVerify =
			await this.emailTokenDatastore.getTokenDetails(token);
		if (!tokenVerify) {
			throw new NotFoundException('Verification token expire');
		}

		const userDetail = await this.userDatastore.getUserByEmail(email);
		if (!userDetail) {
			throw new NotFoundException('User not found');
		}

		const userRole = await this.userDatastore.getUserRoleById(
			userDetail.id,
		);
		if (!userRole) {
			throw new NotFoundException('UserRole not found');
		}
		userRole.isVerified = true;
		await this.userDatastore.saveUserRole(userRole);
		await this.emailTokenDatastore.deleteTokenByRole(userRole.id);
	}

	public async accoutSetup(email: string, password: string): Promise<void> {
		const userDetail = await this.userDatastore.getUserByEmail(email);
		if (!userDetail) {
			throw new NotFoundException('User not found');
		}

		if (userDetail.password) {
			throw new NotFoundException('Password already setup');
		}
		const hashPass = await this.passwordManager.hashPassword(password);
		userDetail.password = hashPass;
		await this.userDatastore.save(userDetail);
	}

	public async getUsersListByBranchId(
		activeUserId: string,
		branchId: string,
	): Promise<FormattedUserResponse[] | undefined> {
		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}

		const existBranch = await this.branchDatastore.getById(branchId);
		if (!existBranch) {
			throw new NotFoundException(`Branch not found`);
		}

		const usersList =
			await this.userDatastore.getUsersListByBranch(branchId);
		const formattedResponse = usersList?.map((userDetail) =>
			userResponse(userDetail),
		);
		return formattedResponse;
	}
}
