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
}
