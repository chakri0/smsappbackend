import { v4 as uuidv4 } from 'uuid';
import { UserDatastore } from '../database/datastores/UserDatastore';
import { NotFoundException } from '../common/exception/NotFoundException';
import { ItemsDatastore } from '../database/datastores/ItemsDatastore';
import {
	InventoryItems,
	statusType,
} from '../database/entities/InventoryItems';
import { InventoryItemsDatastore } from '../database/datastores/InventroyItemsDatastore';
import { InventroyItemsReq } from '../controllers/inventoryItemsController/InventoryItemsController';
import { BranchDatastore } from '../database/datastores/BranchDatastore';

export class InventoryItemsRepository {
	private userDatastore: UserDatastore;
	private itemDatastore: ItemsDatastore;
	private inventroyItemsDatastroe: InventoryItemsDatastore;
	private branchDatastore: BranchDatastore;
	constructor() {
		this.userDatastore = new UserDatastore();
		this.itemDatastore = new ItemsDatastore();
		this.inventroyItemsDatastroe = new InventoryItemsDatastore();
		this.branchDatastore = new BranchDatastore();
	}

	public async addInventoryItems(
		data: InventroyItemsReq,
		activeUserId: string,
	) {
		const {
			availableQuantity,
			itemId,
			quantity,
			expireDate,
			updatedAt,
			branchId,
		} = data;
		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}

		const existItem = await this.itemDatastore.getById(itemId);
		if (!existItem) {
			throw new NotFoundException(`Item not found`);
		}

		const branchDetials = await this.branchDatastore.getById(branchId);
		if (!branchDetials) {
			throw new NotFoundException(`Branch not found`);
		}

		const newInventoryItem = new InventoryItems();
		newInventoryItem.id = uuidv4();
		newInventoryItem.quantity = quantity;
		newInventoryItem.availableQuantity = availableQuantity;
		newInventoryItem.status =
			availableQuantity > 0 ? statusType.inStock : statusType.consumed;
		newInventoryItem.expireDate = new Date(expireDate);
		newInventoryItem.item = existItem;
		newInventoryItem.addedBy = existUser;
		newInventoryItem.updatedAt = new Date(updatedAt);
		newInventoryItem.branch = branchDetials;

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
		const {
			availableQuantity,
			itemId,
			quantity,
			expireDate,
			updatedAt,
			branchId,
		} = data;
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

		const branchDetials = await this.branchDatastore.getById(branchId);
		if (!branchDetials) {
			throw new NotFoundException(`Branch not found`);
		}

		existInventroyItem.quantity = quantity ?? existInventroyItem.quantity;
		existInventroyItem.availableQuantity =
			availableQuantity ?? existInventroyItem.availableQuantity;
		existInventroyItem.status =
			availableQuantity > 0 ? statusType.inStock : statusType.consumed;
		existInventroyItem.expireDate =
			new Date(expireDate) ?? new Date(existInventroyItem.expireDate);
		existInventroyItem.addedBy = existUser;
		existInventroyItem.updatedAt = new Date(updatedAt);
		existInventroyItem.branch = branchDetials;

		await this.inventroyItemsDatastroe.save(existInventroyItem);
	}

	public async deleteInventoryItem(
		inventoryItemId: string,
		activeUserId: string,
	): Promise<void> {
		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}
		const existInventroyItem =
			await this.inventroyItemsDatastroe.getById(inventoryItemId);
		if (!existInventroyItem) {
			throw new NotFoundException(`Inventory item not found`);
		}

		await this.inventroyItemsDatastroe.deleteInventoryItem(inventoryItemId);
	}

	public async getInventoryItemListByBranch(
		activeUserId: string,
		branchId: string,
	): Promise<InventoryItems[] | undefined> {
		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}

		const existBranch = await this.branchDatastore.getById(branchId);
		if (!existBranch) {
			throw new NotFoundException(`Branch not found`);
		}

		const usersList =
			await this.inventroyItemsDatastroe.getInventoryItemsListByBranch(
				branchId,
			);
		return usersList;
	}
}
