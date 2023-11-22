import express from 'express';
import { UserContext } from '../../database/instanses/authentication/UserContext';
import { NotFoundException } from '../../common/exception/NotFoundException';
import { CategoryRepository } from '../../repositories/CategoryRepository';

export interface TypedRequestBody<T> extends Express.Request {
	body: T;
}

export interface CategoryReq {
	name: string;
}

class CategoryController {
	private categoryRepository: CategoryRepository;
	constructor() {
		this.categoryRepository = new CategoryRepository();
	}

	public addCategory: express.RequestHandler = async (
		req: TypedRequestBody<CategoryReq>,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const { name } = req.body;
			const activeUser = UserContext.getActiveUser();
			if (!activeUser) {
				throw new NotFoundException(`User not found`);
			}
			await this.categoryRepository.addCategory(name, activeUser.id);
			res.status(200).json({});
		} catch (error) {
			next(error);
		}
	};

	public categoryList: express.RequestHandler = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const activeUser = UserContext.getActiveUser();
			if (!activeUser) {
				throw new NotFoundException(`User not found`);
			}
			const categoryList = await this.categoryRepository.categoryList(
				activeUser.id,
			);
			res.status(200).json({ categoryList });
		} catch (error) {
			next(error);
		}
	};
	public deleteCategory: express.RequestHandler = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const { categoryId } = req.params;
			const activeUser = UserContext.getActiveUser();
			if (!activeUser) {
				throw new NotFoundException(`User not found`);
			}
			await this.categoryRepository.deleteCategory(
				categoryId,
				activeUser.id,
			);
			res.status(200).json({});
		} catch (error) {
			next(error);
		}
	};
	public updateCategory: express.RequestHandler = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		try {
			const { categoryId } = req.params;
			const { name } = req.body as CategoryReq;
			const activeUser = UserContext.getActiveUser();
			if (!activeUser) {
				throw new NotFoundException(`User not found`);
			}
			await this.categoryRepository.updateCategory(
				name,
				categoryId,
				activeUser.id,
			);
			res.status(200).json({});
		} catch (error) {
			next(error);
		}
	};
}
export default CategoryController;
