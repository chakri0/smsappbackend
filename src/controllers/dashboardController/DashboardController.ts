import express from 'express';
import { UserContext } from '../../database/instanses/authentication/UserContext';
import { NotFoundException } from '../../common/exception/NotFoundException';
import { DashboardRepository } from '../../repositories/DashboardRepository';

export interface TypedRequestBody<T> extends Express.Request {
	body: T;
}

class DashboardController {
	private dashboardRepository: DashboardRepository;
	constructor() {
		this.dashboardRepository = new DashboardRepository();
	}

	public getDashboardDetails: express.RequestHandler = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const activeUser = UserContext.getActiveUser();
			if (!activeUser) {
				throw new NotFoundException(`No user found`);
			}
			const dasboardDetails =
				await this.dashboardRepository.getDashboardDetails(
					activeUser.id,
				);
			res.status(200).json({ dasboardDetails });
		} catch (error) {
			next(error);
		}
	};
}

export default DashboardController;
