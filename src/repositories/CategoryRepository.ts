import { v4 as uuidv4 } from 'uuid';
import { UserDatastore } from '../database/datastores/UserDatastore';
import AuthenticationService from '../database/instanses/authentication/AuthenticationService';
import { Mail } from '../database/instanses/mail/Mail';
import { NotFoundException } from '../common/exception/NotFoundException';
import { Categories } from '../database/entities/Categories';
import { CategoryDatastore } from '../database/datastores/CategoryDatastore';

export class CategoryRepository {
	private userDatastore: UserDatastore;
	private authentication: AuthenticationService;
	private categoryDatastore: CategoryDatastore;
	private mail: Mail;
	constructor() {
		this.userDatastore = new UserDatastore();
		this.authentication = new AuthenticationService();
		this.categoryDatastore = new CategoryDatastore();
		this.mail = new Mail();
	}

	public async addCategory(
		name: string,
		activeUserId: string,
	): Promise<void> {
		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}

		const category = new Categories();
		category.id = uuidv4();
		category.name = name;
		await this.categoryDatastore.save(category);
	}

	public async categoryList(activeUserId: string): Promise<Categories[]> {
		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}

		const categories = await this.categoryDatastore.getAllCategory();
		return categories;
	}

	public async updateCategory(
		name: string,
		categoryId: string,
		activeUserId: string,
	): Promise<void> {
		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}

		const existCategory = await this.categoryDatastore.getById(categoryId);
		if (!existCategory) {
			throw new NotFoundException(`Category not found`);
		}
		existCategory.name;
		await this.categoryDatastore.save(existCategory);
	}

	public async deleteCategory(
		categoryId: string,
		activeUserId: string,
	): Promise<void> {
		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}

		const existCategory = await this.categoryDatastore.getById(categoryId);
		if (!existCategory) {
			throw new NotFoundException(`Category not found`);
		}

		await this.categoryDatastore.deleteBranch(categoryId);
	}
}
