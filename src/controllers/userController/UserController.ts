import express from 'express';
import { UserRepository } from '../../repositories/UserRepositoy';
import { UserContext } from '../../database/instanses/authentication/UserContext';
import { InviteUserReq, LoginReq } from './UserRequest.interface';
import { NotFoundException } from '../../common/exception/NotFoundException';

export interface TypedRequestBody<T> extends Express.Request {
	body: T;
}

class UserController {
	private userRepository: UserRepository;
	constructor() {
		this.userRepository = new UserRepository();
	}

	public userLogin: express.RequestHandler = async (
		req: TypedRequestBody<LoginReq>,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const { email, password } = req.body;
			const user = await this.userRepository.userLogin(email, password);
			res.status(200).json({ user });
		} catch (error) {
			next(error);
		}
	};

	public profile: express.RequestHandler = (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const activeUser = UserContext.getActiveUser();
			res.status(200).json({ activeUser });
		} catch (error) {
			next(error);
		}
	};

	public inviteUser: express.RequestHandler = async (
		req: TypedRequestBody<InviteUserReq>,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const activeUser = UserContext.getActiveUser();
			if (!activeUser) {
				throw new NotFoundException(`No user found`);
			}
			const { firstName, email, role, branchId } = req.body;
			await this.userRepository.userInvite(
				activeUser.id,
				firstName,
				email,
				role,
				branchId,
			);
			res.status(200).json({});
		} catch (error) {
			next(error);
		}
	};

	public verifyUser: express.RequestHandler = async (
		req: TypedRequestBody<{ token: string; email: string }>,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const { token, email } = req.body;
			await this.userRepository.verifyUser(token, email);
			res.status(200).json({});
		} catch (error) {
			next(error);
		}
	};

	public accoutSetup: express.RequestHandler = async (
		req: TypedRequestBody<{ email: string; password: string }>,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const { email, password } = req.body;
			await this.userRepository.accoutSetup(email, password);
			res.status(200).json({});
		} catch (error) {
			next(error);
		}
	};

	public usersListByBranch: express.RequestHandler = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const activeUser = UserContext.getActiveUser();
			if (!activeUser) {
				throw new NotFoundException(`No user found`);
			}
			const { branchId } = req.params;
			const usersList = await this.userRepository.getUsersListByBranchId(
				activeUser.id,
				branchId,
			);
			res.status(200).json({ usersList });
		} catch (error) {
			next(error);
		}
	};
}
export default UserController;
