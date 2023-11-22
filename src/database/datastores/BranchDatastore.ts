import dataSource from '../dataSource';
import datasource from '../dataSource';
import { Branch } from '../entities/Branch';

export class BranchDatastore {
	constructor() {}

	public async getById(id: string): Promise<Branch | null> {
		let queryResult: Branch | undefined | null;
		await datasource.transaction(async (manager) => {
			queryResult = await manager
				.getRepository(Branch)
				.createQueryBuilder('Branch')
				.where('Branch.id = :id', { id: id })
				.getOne();
		});
		if (queryResult) {
			return queryResult;
		}
		return null;
	}

	public async save(branch: Branch): Promise<Branch | undefined> {
		let queryResult: Branch | undefined;
		await dataSource.transaction(async (manager) => {
			queryResult = await manager.save(branch);
		});
		if (queryResult) {
			return queryResult;
		}
	}

	public async getAllBranch(): Promise<Branch[]> {
		let queryResult: Branch[] = [];
		await datasource.transaction(async (manager) => {
			queryResult = await manager
				.getRepository(Branch)
				.createQueryBuilder('Branch')
				.getMany();
		});
		return queryResult;
	}

	public async deleteBranch(branchId: string): Promise<void> {
		await datasource.transaction(async (manager) => {
			await manager
				.getRepository(Branch)
				.createQueryBuilder('Branch')
				.delete()
				.where('Branch.id = :id', { id: branchId })
				.execute();
		});
	}
}
