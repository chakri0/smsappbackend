import dataSource from '../dataSource';
import { Items } from '../entities/Items';

export class ItemsDatastore {
	constructor() {}

	public async save(item: Items): Promise<Items | undefined> {
		let queryResult: Items | undefined;
		await dataSource.transaction(async (manager) => {
			queryResult = await manager.save(item);
		});
		if (queryResult) {
			return queryResult;
		}
	}

	public async getAllItems(): Promise<Items[]> {
		let queryResult: Items[] = [];
		await dataSource.transaction(async (manager) => {
			queryResult = await manager
				.getRepository(Items)
				.createQueryBuilder('Items')
				.leftJoinAndSelect('Items.category', 'category')
				.getMany();
		});
		return queryResult;
	}

	public async deleteItem(itemId: string): Promise<void> {
		await dataSource.transaction(async (manager) => {
			await manager
				.getRepository(Items)
				.createQueryBuilder('Items')
				.delete()
				.where('Items.id = :id', { id: itemId })
				.execute();
		});
	}

	public async getById(itemId: string): Promise<Items | null> {
		let queryResult: Items | undefined | null;
		await dataSource.transaction(async (manager) => {
			queryResult = await manager
				.getRepository(Items)
				.createQueryBuilder('Items')
				.where('Items.id = :id', { id: itemId })
				.getOne();
		});
		if (queryResult) {
			return queryResult;
		}
		return null;
	}

	public async getTotalItems(): Promise<number> {
		try {
			let queryResult: number | undefined = 0;
			await dataSource.transaction(async (manager) => {
				queryResult = await manager
					.getRepository(Items)
					.createQueryBuilder('Items')
					.select('COUNT(items.id)', 'count')
					.getRawOne();
			});
			return queryResult ?? 0;
		} catch (error) {
			console.error('Error in getTotalItems:', error);
			throw error;
		}
	}

	public async getTotalItemsByBranch(branchId: string): Promise<number> {
		try {
			let queryResult: number | undefined = 0;
			await dataSource.transaction(async (manager) => {
				queryResult = await manager
					.getRepository(Items)
					.createQueryBuilder('Items')
					.select('COUNT(Items.id)', 'count')
					.where('Items.branch = :branchId', { branchId })
					.getRawOne();
			});
			return queryResult ?? 0;
		} catch (error) {
			console.error('Error in getTotalItemsByBranch:', error);
			throw error;
		}
	}

	public async getItemsListByBranch(
		branchId: string,
	): Promise<Items[] | undefined> {
		let queryResult: Items[] | undefined | null;
		await dataSource.transaction(async (manager) => {
			queryResult = await manager
				.getRepository(Items)
				.createQueryBuilder('Items')
				.leftJoinAndSelect('Items.category', 'category')
				.leftJoinAndSelect('Items.branch', 'branch')
				.where('Items.branch = :branchId', { branchId })
				.getMany();
		});

		if (queryResult) {
			return queryResult;
		}
	}
}
