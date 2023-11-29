import dataSource from '../dataSource';
import { InventoryItems } from '../entities/InventoryItems';

export class InventoryItemsDatastore {
	constructor() {}

	public async save(
		item: InventoryItems,
	): Promise<InventoryItems | undefined> {
		let queryResult: InventoryItems | undefined;
		await dataSource.transaction(async (manager) => {
			queryResult = await manager.save(item);
		});
		if (queryResult) {
			return queryResult;
		}
	}

	public async getAllInventoryItems(): Promise<InventoryItems[]> {
		let queryResult: InventoryItems[] = [];
		await dataSource.transaction(async (manager) => {
			queryResult = await manager
				.getRepository(InventoryItems)
				.createQueryBuilder('InventoryItems')
				.leftJoinAndSelect('InventoryItems.item', 'item')
				.leftJoin('InventoryItems.addedBy', 'addedBy')
				.addSelect([
					'addedBy.id',
					'addedBy.email',
					'addedBy.firstName',
					'addedBy.lastName',
				])
				.getMany();
		});
		return queryResult;
	}

	public async deleteInventoryItem(itemId: string): Promise<void> {
		await dataSource.transaction(async (manager) => {
			await manager
				.getRepository(InventoryItems)
				.createQueryBuilder('InventoryItems')
				.delete()
				.where('InventoryItems.id = :id', { id: itemId })
				.execute();
		});
	}

	public async getById(
		inventoryItemId: string,
	): Promise<InventoryItems | null> {
		let queryResult: InventoryItems | undefined | null;
		await dataSource.transaction(async (manager) => {
			queryResult = await manager
				.getRepository(InventoryItems)
				.createQueryBuilder('InventoryItems')
				.where('InventoryItems.id = :id', { id: inventoryItemId })
				.getOne();
		});
		if (queryResult) {
			return queryResult;
		}
		return null;
	}
}
