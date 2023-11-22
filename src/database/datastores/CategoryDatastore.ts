import dataSource from '../dataSource';
import { Categories } from '../entities/Categories';

export class CategoryDatastore {
	constructor() {}

	public async save(category: Categories): Promise<Categories | undefined> {
		let queryResult: Categories | undefined;
		await dataSource.transaction(async (manager) => {
			queryResult = await manager.save(category);
		});
		if (queryResult) {
			return queryResult;
		}
	}

	public async getAllCategory(): Promise<Categories[]> {
		let queryResult: Categories[] = [];
		await dataSource.transaction(async (manager) => {
			queryResult = await manager
				.getRepository(Categories)
				.createQueryBuilder('Categories')
				.getMany();
		});
		return queryResult;
	}

	public async deleteBranch(categoryId: string): Promise<void> {
		await dataSource.transaction(async (manager) => {
			await manager
				.getRepository(Categories)
				.createQueryBuilder('Categories')
				.delete()
				.where('Categories.id = :id', { id: categoryId })
				.execute();
		});
	}

	public async getById(categoryId: string): Promise<Categories | null> {
		let queryResult: Categories | undefined | null;
		await dataSource.transaction(async (manager) => {
			queryResult = await manager
				.getRepository(Categories)
				.createQueryBuilder('Categories')
				.where('Categories.id = :id', { id: categoryId })
				.getOne();
		});
		if (queryResult) {
			return queryResult;
		}
		return null;
	}
}
