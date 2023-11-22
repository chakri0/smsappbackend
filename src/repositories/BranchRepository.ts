import { v4 as uuidv4 } from 'uuid';
import { UserDatastore } from '../database/datastores/UserDatastore';
import AuthenticationService from '../database/instanses/authentication/AuthenticationService';
import { BranchDatastore } from '../database/datastores/BranchDatastore';
import { EmailTokenDatastore } from '../database/datastores/EmailTokenDatastore';
import { Mail } from '../database/instanses/mail/Mail';
import { NotFoundException } from '../common/exception/NotFoundException';
import {
	AddBranchReq,
	EditBranchReq,
} from '../controllers/branchController/BranchRequest.interface';
import { Branch } from '../database/entities/Branch';
import { permission } from '../common/helpers/Constant';

export class BranchRepository {
	private userDatastore: UserDatastore;
	private authentication: AuthenticationService;
	private branchDatastore: BranchDatastore;
	private emailTokenDatastore: EmailTokenDatastore;
	private mail: Mail;
	constructor() {
		this.userDatastore = new UserDatastore();
		this.authentication = new AuthenticationService();
		this.branchDatastore = new BranchDatastore();
		this.emailTokenDatastore = new EmailTokenDatastore();
		this.mail = new Mail();
	}

	public async addBranch(data: AddBranchReq, activeUserId: string) {
		const { storeAddress, storeName, image, phoneNumber } = data;

		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}

		if (!permission.includes(existUser.role.roleName)) {
			throw new NotFoundException(`You  donot have access`);
		}

		const branch = new Branch();
		branch.id = uuidv4();
		branch.storeName = storeName;
		branch.storeAddress = storeAddress;
		branch.phoneNumber = phoneNumber ?? null;
		branch.image = image ?? null;

		await this.branchDatastore.save(branch);
	}

	public async branchList(activeUserId: string): Promise<Branch[]> {
		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}

		const getbranches = await this.branchDatastore.getAllBranch();
		return getbranches;
	}

	public async updateBranch(
		data: EditBranchReq,
		branchId: string,
		activeUserId: string,
	): Promise<void> {
		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}

		const existBranch = await this.branchDatastore.getById(branchId);
		if (!existBranch) {
			throw new NotFoundException(`Branch not found`);
		}
		existBranch.storeName = data.storeName ?? existBranch.storeName;
		existBranch.storeAddress =
			data.storeAddress ?? existBranch.storeAddress;
		existBranch.phoneNumber = data.phoneNumber ?? existBranch.phoneNumber;
		existBranch.image = data.image ?? existBranch.image;

		await this.branchDatastore.save(existBranch);
	}

	public async deleteBranch(
		branchId: string,
		activeUserId: string,
	): Promise<void> {
		const existUser = await this.userDatastore.getById(activeUserId);
		if (!existUser) {
			throw new NotFoundException(`User not found`);
		}

		const existBranch = await this.branchDatastore.getById(branchId);
		if (!existBranch) {
			throw new NotFoundException(`Branch not found`);
		}

		await this.branchDatastore.deleteBranch(branchId);
	}
}
