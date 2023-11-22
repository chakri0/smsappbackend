import express from 'express';
import { BranchRepository } from '../../repositories/BranchRepository';
import { AddBranchReq, EditBranchReq } from './BranchRequest.interface';
import { UserContext } from '../../database/instanses/authentication/UserContext';
import { NotFoundException } from '../../common/exception/NotFoundException';

export interface TypedRequestBody<T> extends Express.Request {
	body: T;
}

class BranchController {
	private branchRepository: BranchRepository;
	constructor() {
		this.branchRepository = new BranchRepository();
	}

	public addBranch: express.RequestHandler = async (
		req: TypedRequestBody<AddBranchReq>,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const activeUser = UserContext.getActiveUser();
			if (!activeUser) {
				throw new NotFoundException(`No user found`);
			}
			const data = req.body;
			await this.branchRepository.addBranch(data, activeUser.id);
			res.status(201).json({});
		} catch (error) {
			next(error);
		}
	};

	public branchList: express.RequestHandler = async (
		req: TypedRequestBody<AddBranchReq>,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const activeUser = UserContext.getActiveUser();
			if (!activeUser) {
				throw new NotFoundException(`No user found`);
			}
			const branches = await this.branchRepository.branchList(
				activeUser.id,
			);
			res.status(200).json({ branches });
		} catch (error) {
			next(error);
		}
	};

	public updateBranch: express.RequestHandler = async (
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
			const data = req.body as EditBranchReq;
			await this.branchRepository.updateBranch(
				data,
				branchId,
				activeUser.id,
			);
			res.status(201).json({});
		} catch (error) {
			next(error);
		}
	};

	public deleteBranch: express.RequestHandler = async (
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
			await this.branchRepository.deleteBranch(branchId, activeUser.id);
			res.status(201).json({});
		} catch (error) {
			next(error);
		}
	};
}

export default BranchController;
