import express from 'express';
import { PayloadType } from './AuthenticationService';

export interface IAuthenticationService {
	getAccessToken(payload: PayloadType): string;
	verifyAccessToken(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	): Promise<void>;
}
