import { itemTotalStockResponse } from '../../repositories/DashboardRepository';
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
				.leftJoinAndSelect('item.category', 'category')
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

	public async getByItemId(itemId: string): Promise<InventoryItems | null> {
		let queryResult: InventoryItems | undefined | null;
		await dataSource.transaction(async (manager) => {
			queryResult = await manager
				.getRepository(InventoryItems)
				.createQueryBuilder('InventoryItems')
				.leftJoinAndSelect('InventoryItems.item', 'item')
				.where('item.id = :id', { id: itemId })
				.getOne();
		});
		if (queryResult) {
			return queryResult;
		}
		return null;
	}

	public async getItemsTotalStocks(): Promise<itemTotalStockResponse[]> {
		try {
			let queryResult: itemTotalStockResponse[] = [];
			await dataSource.transaction(async (manager) => {
				queryResult = await manager
					.getRepository(InventoryItems)
					.createQueryBuilder('inventoryitems')
					.select([
						'items.name as itemName',
						'SUM(inventoryitems.availableQuantity) as availableQuantity',
						'(SUM(inventoryitems.quantity) - SUM(inventoryitems.availableQuantity)) as dailyConsumption',
						'items.dailyThreshold',
						'items.weeklyThreshold',
						'items.overallThreshold',
						'categories.name as category',
					])
					.leftJoin(
						'items',
						'items',
						'items.id = inventoryitems.itemId',
					)
					.leftJoin(
						'categories',
						'categories',
						'categories.id = items.categoryId',
					)
					.groupBy('items.id')
					.getRawMany();
			});
			return queryResult;
		} catch (error) {
			console.error('Error in getInventorySummary:', error);
			throw error; // Rethrow the error for the calling code to handle
		}
	}

	public async getInventoryItemsListByBranch(
		branchId: string,
	): Promise<InventoryItems[] | undefined> {
		let queryResult: InventoryItems[] | undefined | null;
		await dataSource.transaction(async (manager) => {
			queryResult = await manager
				.getRepository(InventoryItems)
				.createQueryBuilder('InventoryItems')
				.leftJoinAndSelect('InventoryItems.item', 'item')
				.leftJoinAndSelect('item.category', 'category')
				.leftJoinAndSelect('InventoryItems.branch', 'branch')
				.leftJoin('InventoryItems.addedBy', 'addedBy')
				.addSelect([
					'addedBy.id',
					'addedBy.email',
					'addedBy.firstName',
					'addedBy.lastName',
				])
				.where('InventoryItems.branch = :branchId', { branchId })
				.getMany();
		});

		if (queryResult) {
			return queryResult;
		}
	}

	public async getInventoryTotalStocksByBranch(
		branchId: string,
	): Promise<number> {
		try {
			let queryResult: number | undefined;
			await dataSource.transaction(async (manager) => {
				queryResult = await manager
					.getRepository(InventoryItems)
					.createQueryBuilder('inventoryitems')
					.select(
						'SUM(inventoryitems.availableQuantity)',
						'totalAvailableQuantity',
					)
					.where('inventoryitems.branchId = :branchId', { branchId })
					.groupBy('inventoryitems.branchId')
					.getRawOne();
			});
			return queryResult ?? 0;
		} catch (error) {
			console.error('Error in getInventorySummary:', error);
			throw error; // Rethrow the error for the calling code to handle
		}
	}

	public async getLowInventoryStocksBranch(
		branchId: string,
	): Promise<InventoryItems[]> {
		try {
			let queryResult: InventoryItems[] = [];
			await dataSource.transaction(async (manager) => {
				queryResult = await manager
					.getRepository(InventoryItems)
					.createQueryBuilder('InventoryItems')
					// .leftJoin(
					// 	'items',
					// 	'items',
					// 	'items.id = InventoryItems.itemId',
					// )
					.leftJoin('InventoryItems.item', 'item')
					.addSelect(['item.id', 'item.name'])
					.leftJoin('InventoryItems.branch', 'branch')
					.addSelect(['branch.id', 'branch.storeName'])
					.leftJoin('InventoryItems.addedBy', 'addedBy')
					.addSelect([
						'addedBy.id',
						'addedBy.email',
						'addedBy.firstName',
						'addedBy.lastName',
					])
					.where('InventoryItems.branchId = :branchId', { branchId })
					.groupBy('InventoryItems.branchId')
					.groupBy('item.id')
					.having(
						'SUM(InventoryItems.availableQuantity) < MAX(`item`.overallThreshold)',
					)
					.getMany();
			});
			return queryResult;
		} catch (error) {
			console.error('Error in getInventorySummary:', error);
			throw error; // Rethrow the error for the calling code to handle
		}
	}

	public async getRecentOrdersByBranch(
		branchId: string,
	): Promise<InventoryItems[]> {
		try {
			let queryResult: InventoryItems[] = [];
			await dataSource.transaction(async (manager) => {
				queryResult = await manager
					.getRepository(InventoryItems)
					.createQueryBuilder('InventoryItems')
					.leftJoin('InventoryItems.item', 'item')
					.addSelect(['item.id', 'item.name'])
					.leftJoin('InventoryItems.branch', 'branch')
					.addSelect(['branch.id', 'branch.storeName'])
					.leftJoin('InventoryItems.addedBy', 'addedBy')
					.addSelect([
						'addedBy.id',
						'addedBy.email',
						'addedBy.firstName',
						'addedBy.lastName',
					])
					.where('InventoryItems.branch = :branchId', { branchId })
					.orderBy('inventoryitems.addedAt')
					.limit(10)
					.getMany();
			});
			return queryResult;
		} catch (error) {
			console.error('Error in getInventorySummary:', error);
			throw error; // Rethrow the error for the calling code to handle
		}
	}

	public async getTotalItemsWastedByBranch(
		branchId: string,
	): Promise<number | undefined> {
		try {
			let queryResult: number | undefined;
			await dataSource.transaction(async (manager) => {
				queryResult = await manager
					.getRepository(InventoryItems)
					.createQueryBuilder('inventoryitems')
					.select('COUNT(*)', 'count')
					.where('inventoryitems.branchId = :branchId', { branchId })
					.andWhere('CURRENT_DATE > expireDate')
					.groupBy('inventoryitems.branchId')
					.getRawOne();
			});
			return queryResult;
		} catch (error) {
			console.error('Error in getInventorySummary:', error);
			throw error; // Rethrow the error for the calling code to handle
		}
	}

	public async getItemsWastedByBranch(
		branchId: string,
	): Promise<InventoryItems[]> {
		try {
			let queryResult: InventoryItems[] = [];
			await dataSource.transaction(async (manager) => {
				queryResult = await manager
					.getRepository(InventoryItems)
					.createQueryBuilder('inventoryitems')
					.select([
						'items.name as itemName',
						'SUM(inventoryitems.availableQuantity) as wastedQuantity',
					])
					.leftJoin(
						'items',
						'items',
						'items.id = inventoryitems.itemId',
					)
					.where('inventoryitems.branchId = :branchId', { branchId })
					.andWhere('CURRENT_DATE > expireDate')
					.groupBy('items.id')
					.getRawMany();
			});
			return queryResult;
		} catch (error) {
			console.error('Error in getInventorySummary:', error);
			throw error; // Rethrow the error for the calling code to handle
		}
	}
}
