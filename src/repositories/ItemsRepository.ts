import { v4 as uuidv4 } from 'uuid';
import { UserDatastore } from '../database/datastores/UserDatastore';
import { NotFoundException } from '../common/exception/NotFoundException';
import { ItemsReq } from '../controllers/itemsController/itemsController';
import { Items } from '../database/entities/Items';
import { CategoryDatastore } from '../database/datastores/CategoryDatastore';
import { ItemsDatastore } from '../database/datastores/ItemsDatastore';
import { BranchDatastore } from '../database/datastores/BranchDatastore';

export class ItemsRepository {
	private userDatastore: UserDatastore;
	private categoryDatastore: CategoryDatastore;
	private itemDatastore: ItemsDatastore;
	private branchDatastore: BranchDatastore;
	constructor() {
		this.userDatastore = new UserDatastore();
		this.categoryDatastore = new CategoryDatastore();
		this.itemDatastore = new ItemsDatastore();
		this.branchDatastore = new BranchDatastore();
	}

	public async addItem(data: ItemsReq, activeUserId: string) {
		const {
			categoryId,
			name,
			description,
			image,
			dailyThreshold,
			weeklyThreshold,
			overallThreshold,
			branchId,
		} = data;

		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}

		const category = await this.categoryDatastore.getById(categoryId);
		if (!category) {
			throw new NotFoundException(`Category not found`);
		}

		const branchDetials = await this.branchDatastore.getById(branchId);
		if (!branchDetials) {
			throw new NotFoundException(`Branch not found`);
		}
		const item = new Items();
		item.id = uuidv4();
		(item.name = name),
			(item.description = description ?? null),
			(item.image = image ?? null),
			(item.dailyThreshold = dailyThreshold ?? null),
			(item.weeklyThreshold = weeklyThreshold ?? null),
			(item.overallThreshold = overallThreshold ?? null);
		item.category = category;
		item.branch = branchDetials;
		await this.itemDatastore.save(item);
	}

	public async itemList(activeUserId: string): Promise<Items[]> {
		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}

		const items = await this.itemDatastore.getAllItems();
		return items;
	}

	public async updateItem(
		data: ItemsReq,
		itemId: string,
		activeUserId: string,
	): Promise<void> {
		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}

		const doesItemExist = await this.itemDatastore.getById(itemId);
		if (!doesItemExist) {
			throw new NotFoundException(`Item not found`);
		}
		const category = await this.categoryDatastore.getById(data.categoryId);
		if (!category) {
			throw new NotFoundException(`Category not found`);
		}

		const branchDetials = await this.branchDatastore.getById(data.branchId);
		if (!branchDetials) {
			throw new NotFoundException(`Branch not found`);
		}
		(doesItemExist.name = data.name),
			(doesItemExist.description = data.description ?? null),
			(doesItemExist.image = data.image ?? null),
			(doesItemExist.dailyThreshold = data.dailyThreshold ?? null),
			(doesItemExist.weeklyThreshold = data.weeklyThreshold ?? null),
			(doesItemExist.overallThreshold = data.overallThreshold ?? null);
		doesItemExist.category = category;
		doesItemExist.branch = branchDetials;

		await this.itemDatastore.save(doesItemExist);
	}

	public async deleteItem(
		itemId: string,
		activeUserId: string,
	): Promise<void> {
		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}

		const doesItemExist = await this.itemDatastore.getById(itemId);
		if (!doesItemExist) {
			throw new NotFoundException(`Branch not found`);
		}

		await this.itemDatastore.deleteItem(itemId);
	}

	public async getItemListByBranch(
		activeUserId: string,
		branchId: string,
	): Promise<Items[] | undefined> {
		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}

		const existBranch = await this.branchDatastore.getById(branchId);
		if (!existBranch) {
			throw new NotFoundException(`Branch not found`);
		}

		const usersList =
			await this.itemDatastore.getItemsListByBranch(branchId);
		return usersList;
	}
}
