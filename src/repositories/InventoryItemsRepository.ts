import { v4 as uuidv4 } from 'uuid';
import { UserDatastore } from '../database/datastores/UserDatastore';
import { NotFoundException } from '../common/exception/NotFoundException';
import { ItemsDatastore } from '../database/datastores/ItemsDatastore';
import { InventoryItems } from '../database/entities/InventoryItems';
import { InventoryItemsDatastore } from '../database/datastores/InventroyItemsDatastore';
import { InventroyItemsReq } from '../controllers/inventoryItemsController/inventoryItemsController';

export class InventoryItemsRepository {
	private userDatastore: UserDatastore;
	private itemDatastore: ItemsDatastore;
	private inventroyItemsDatastroe: InventoryItemsDatastore;
	constructor() {
		this.userDatastore = new UserDatastore();
		this.itemDatastore = new ItemsDatastore();
		this.inventroyItemsDatastroe = new InventoryItemsDatastore();
	}

	public async addInventoryItems(
		data: InventroyItemsReq,
		activeUserId: string,
	) {
		const { availableQuantity, itemId, quantity, expireDate, status } =
			data;
		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}

		const existItem = await this.itemDatastore.getById(itemId);
		if (!existItem) {
			throw new NotFoundException(`Item not found`);
		}

		const newInventoryItem = new InventoryItems();
		newInventoryItem.id = uuidv4();
		newInventoryItem.quantity = quantity;
		newInventoryItem.availableQuantity = availableQuantity;
		newInventoryItem.status = status;
		newInventoryItem.expireDate = expireDate;
		newInventoryItem.item = existItem;
		newInventoryItem.addedBy = existUser;
		await this.inventroyItemsDatastroe.save(newInventoryItem);
	}

	public async inventoryItemsList(
		activeUserId: string,
	): Promise<InventoryItems[]> {
		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}

		const items = await this.inventroyItemsDatastroe.getAllInventoryItems();
		return items;
	}

	public async updateInventoryItems(
		data: InventroyItemsReq,
		inventoryItemId: string,
		activeUserId: string,
	): Promise<void> {
		const { availableQuantity, itemId, quantity, expireDate, status } =
			data;
		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}

		const doesItemExist = await this.itemDatastore.getById(itemId);
		if (!doesItemExist) {
			throw new NotFoundException(`Item not found`);
		}

		const existInventroyItem =
			await this.inventroyItemsDatastroe.getById(inventoryItemId);
		if (!existInventroyItem) {
			throw new NotFoundException(`InventroyItem not found`);
		}

		existInventroyItem.quantity = quantity ?? existInventroyItem.quantity;
		existInventroyItem.availableQuantity =
			availableQuantity ?? existInventroyItem.availableQuantity;
		existInventroyItem.status = status ?? existInventroyItem.status;
		existInventroyItem.expireDate =
			expireDate ?? existInventroyItem.expireDate;
		existInventroyItem.addedBy = existUser;
		await this.inventroyItemsDatastroe.save(existInventroyItem);
	}
}
