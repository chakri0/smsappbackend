import jwt from 'jsonwebtoken';
import express from 'express';
import config from '../../../config/config';
import { UserContext } from './UserContext';
import { UserDatastore } from '../../datastores/UserDatastore';
import { NotFoundException } from '../../../common/exception/NotFoundException';

const userDatastore = new UserDatastore();
export interface PayloadType {
	userId: string;
	userRoleId: string;
}
export class AuthenticationService {
	public getAccessToken(payload: PayloadType): string {
		const token = jwt.sign(payload, config.jwtSecretKey, {
			expiresIn: '1d',
		});
		return token;
	}

	public verifyAccessToken: express.RequestHandler = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		const token = req.headers.authorization;
		if (!token) {
			return res.status(401).json({ message: 'No token provided' });
		}
		try {
			const payload = jwt.verify(
				token,
				config.jwtSecretKey,
			) as PayloadType;
			const userDetail = await userDatastore.getById(payload.userId);

			if (!userDetail) {
				throw new NotFoundException(`User not found`);
			}
			UserContext.storeUserDetails(userDetail);
			next();
		} catch (error) {
			return res.status(403).json({ message: 'Token is invalid' });
		}
	};
}

export default AuthenticationService;
